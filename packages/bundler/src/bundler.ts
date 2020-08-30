import { Operation, resource } from 'effection';
import { on } from '@effection/events';
import { subscribe, Subscribable, SymbolSubscribable, ChainableSubscription } from '@effection/subscription';
import { Channel } from '@effection/channel';
import { watch, RollupWatchOptions, RollupWatcherEvent, RollupWatcher } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { BundlerMessage, BundleOptions, BundlerOptions, ValidatorState, Validator, BundlerWarning, BundlerError } from './types';
import { EslintValidator } from './validators/eslint';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import babel from '@rollup/plugin-babel';

function prepareRollupOptions(bundles: BundleOptions[], channel: Channel<BundlerMessage>, { mainFields }: BundlerOptions = { mainFields: ["browser", "module", "main"] }): RollupWatchOptions[] {
  return bundles.map<RollupWatchOptions>(bundle => {
    return {
      input: bundle.entry,
      output: {
        file: bundle.outFile,
        name: bundle.globalName || undefined,
        sourcemap: true,
        format: 'umd',
      },
      onwarn(warning){
        channel.send({ type: 'WARN', warning })
      },
      watch: {
        // Rollup types are wrong; `watch.exclude` allows RegExp[]
        exclude: [/node_modules/ as unknown as string]
      },
      plugins: [
        resolve({
          mainFields,
          extensions: ['.js', '.ts']
        }),
        commonjs(),
        babel({
          babelHelpers: 'runtime',
          extensions: ['.js', '.ts'],
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
          plugins: ['@babel/plugin-transform-runtime']
        }),
        injectProcessEnv({
          NODE_ENV: 'production'
        }),
      ]
    }
  });
}

const Validators = [EslintValidator];

export class Bundler implements Subscribable<BundlerMessage, undefined> {
  private channel = new Channel<BundlerMessage>();

  *validate(bundles: BundleOptions[]) {
    let warnings: BundlerWarning[] = [];
    let errors: BundlerError[] = [];

    this.channel.send({ type: 'VALIDATING' });

    let validators = bundles.flatMap(bundle => Validators.map(V => new V(bundle)));
    
    for (let validator of validators) {
      let validatorEvents: ChainableSubscription<ValidatorState, Validator> = yield subscribe(validator);

      yield validator.validate();

      yield validatorEvents.forEach(function* (state) {
        if(state.type === 'INVALID') {
          warnings.push(...state.warnings);
          errors.push(...state.errors);
        }
      });
    }

    // TODO: do we fail on warnings also
    if(errors.length === 0) {
      return { type: 'VALID'};
    }

    return { type: 'INVALID', warnings, errors };
  }

  static *create(bundles: BundleOptions[]): Operation<Bundler> {
    let bundler = new Bundler();

    return yield resource(bundler, function* () {
      let validationState: ValidatorState = yield bundler.validate(bundles);

      console.error('returned from validate')

      if(validationState.type === 'INVALID') {
        console.error('we are bad');
        bundler.channel.send({ type: 'ERROR', errors: validationState.errors });
        bundler.channel.close();
        return;
      }

      console.error('we are good');

      bundler.channel.send({ type: 'VALID' });
      
      let rollup: RollupWatcher = watch(prepareRollupOptions(bundles, bundler.channel));

      try {
        let events: ChainableSubscription<RollupWatcherEvent[], BundlerMessage> = yield subscribe(on(rollup, 'event'));
   
        let messages = events
          .map(([event]) => event)
          .filter(event => ['START', 'END', 'ERROR'].includes(event.code))
          .map(event => {
            switch (event.code) {
              case 'START':
                return { type: 'START' } as const;
              case 'END':
                return { type: 'UPDATE' } as const;
              case 'ERROR':
                return { type: 'ERROR', errors: [event.error] as BundlerError[] } as const;
              default: 
                throw new Error(`unexpect event ${event.code}`);
            }
          });
          
        yield messages.forEach(function* (message) {
          bundler.channel.send(message);
        });
      } finally {
        console.debug('[bundler] shutting down');
        
        rollup.close();
      }
    });
  }

  [SymbolSubscribable]() {
    return this.channel[SymbolSubscribable]();
  }
}