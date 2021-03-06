import { TestImplementation, Context, Step, Assertion } from './interfaces';

export function test<C extends Context>(description: string): TestBuilder<C> {
  return new TestBuilder<C>({
    description,
    steps: [],
    assertions: [],
    children: []
  });
}

export type Action<C extends Context, R extends Context | void> = (context: C) => Promise<R> | R;
export type Check<C extends Context> = (context: C) => Promise<void> | void;

export interface StepDefinition<C extends Context, R extends Context | void> {
  description: string;
  action: Action<C,R>;
}
type StepList<C extends Context> = [StepDefinition<C,void>, ...StepDefinition<C,void>[]];

export interface AssertionDefinition<C extends Context> {
  description: string;
  check: Check<C>;
}

type AssertionList<C extends Context> = [AssertionDefinition<C>, ...AssertionDefinition<C>[]];

class TestStructureError extends Error {
  name = 'TestStructureError'

  constructor(message: string) {
    super(message + '\n\nBigTest tests separate assertions and steps, where assertions should not affect application state and only verify behaviour. Assertions and children are always run after steps, so you cannot add them out of order.');
  }
}

type TestBuilderState = 'step' | 'assertion' | 'child';

export class TestBuilder<C extends Context> implements TestImplementation {
  public description: string;
  public steps: Step[];
  public assertions: Assertion[];
  public children: TestImplementation[];

  constructor(test: TestImplementation, private state = 'step') {
    this.description = test.description;
    this.steps = test.steps;
    this.assertions = test.assertions;
    this.children = test.children;
  }

  step<R extends Context | void>(...steps: StepList<C>): TestBuilder<C>;
  step<R extends Context | void>(description: string, action: Action<C,R>): TestBuilder<R extends void ? C : C & R>;
  step<R extends Context | void>(...args: [string, Action<C,R>] | StepList<C>): TestBuilder<R extends void ? C : C & R> {
    if(this.state === 'assertion' || this.state === 'child') {
      throw new TestStructureError(`Cannot add step after adding ${this.state}`);
    }

    function getSteps(): Step[] {
      let [first, second] = args;
      if (typeof first === 'string') {
        return [{
          description: first,
          action: second ? second : async () => undefined
        }] as Step[];
      } else {
        return args as Step[];
      }
    }

    return new TestBuilder({
      ...this,
      steps: this.steps.concat(getSteps()),
    });
  }

  assertion(...assertions: AssertionList<C>): TestBuilder<C>;
  assertion(description: string, check: Check<C>): TestBuilder<C>;
  assertion(...args: [string, Check<C>] | AssertionList<C>): TestBuilder<C> {
    if(this.state === 'child') {
      throw new TestStructureError(`Cannot add step after adding ${this.state}`);
    }

    function getAssertions(): Assertion[] {
      let [first, second] = args;
      if (typeof first === 'string') {
        return [{
          description: first,
          check: second ? second : async () => undefined
        }] as Assertion[]
      } else {
        return args as Assertion[];
      }
    }

    return new TestBuilder({
      ...this,
      assertions: this.assertions.concat(getAssertions()),
    }, 'assertion');
  }

  child(description: string, childFn: (inner: TestBuilder<C>) => TestBuilder<Context>): TestBuilder<C> {
    let child = childFn(test(description));
    return new TestBuilder({
      ...this,
      children: this.children.concat(child)
    }, 'child');
  }
}
