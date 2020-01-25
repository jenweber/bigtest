import { when } from '~/when';
import { Test } from 'mocha';

const it = (title: string, fn?: () => Promise<any>) => window.it(title, fn ? () => when(fn) : undefined);

it.only = (title: string, fn: () => Promise<any> = async () => {}) =>
  window.it.only(title, fn ? () => when(fn) : undefined);
it.skip = window.it.skip;
it.retries = window.it.retries;

export { it };