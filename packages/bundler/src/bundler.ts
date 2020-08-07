import { Operation, resource } from 'effection';
import { on } from '@effection/events';
import { subscribe, Subscribable, SymbolSubscribable, ChainableSubscription } from '@effection/subscription';
import { Channel } from '@effection/channel';
import { watch, RollupWatchOptions, RollupWatcherEvent, RollupWatcher, RollupWarning, RollupError } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import babel from '@rollup/plugin-babel';

interface BundleOptions {
  entry: string;
  outFile: string;
  globalName?: string;
};

interface BundlerOptions {
  mainFields: Array<"browser" | "main" | "module">;
};

// could Pick<T> the relevant bits from these types
// lots of good error info in RollupError and RollupWarning
export type BundlerError = RollupError;
export type BundlerWarning = RollupWarning;

export type BundlerMessage =
  | { type: 'update' }
  | { type: 'warn'; warning: BundlerWarning }
  | { type: 'error'; error: BundlerError }

function prepareRollupOptions(bundles: Array<BundleOptions>, { mainFields }: BundlerOptions = { mainFields: ["browser", "module", "main"] }): Array<RollupWatchOptions> {
  return bundles.map(bundle => {
    return {
      input: bundle.entry,
      output: {
        file: bundle.outFile,
        name: bundle.globalName || undefined,
        sourcemap: true,
        format: 'umd',
      },
      // can we use this for warnings?
      // onwarn(warning){
      //   console.warn(warning);
      // },
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

export class Bundler implements Subscribable<BundlerMessage, undefined> {
  private channel = new Channel<BundlerMessage>();

  static *create(bundles: Array<BundleOptions>): Operation<Bundler> {
    let bundler = new Bundler();

    return yield resource(bundler, function* () {
      let rollup: RollupWatcher = watch(prepareRollupOptions(bundles));

      try {
        let events: ChainableSubscription<RollupWatcherEvent[], BundlerMessage> = yield subscribe(on(rollup, 'event'));
   
        let messages = events
          .map(([event]) => event)
          .filter(event => ['END', 'ERROR'].includes(event.code))
          .map(event => event.code === 'ERROR' ? { type: 'error', error: event.error } as const : { type: 'update' } as const);

        yield messages.forEach(function* (message) {
          bundler.channel.send(message);
        });
      } finally {
        rollup.close();
      }
    });
  }

  [SymbolSubscribable]() {
    return this.channel[SymbolSubscribable]();
  }
}