import type { BackgroundColor, ForegroundColor } from 'chalk';
import { LogCategory } from '../../types';

export type LoggerType = {
  [key in LogCategory]: { bg: typeof BackgroundColor; msg: string; text: typeof ForegroundColor };
};

export const logCategories: LoggerType = {
  warn: {
    bg: 'bgYellow',
    msg: ' WARNING ',
    text: 'yellow',
  },
  debug: {
    bg: 'bgWhite',
    msg: ' DEBUG ',
    text: 'white',
  },
  info: {
    bg: 'bgCyan',
    msg: ' INFO ',
    text: 'cyan',
  },
  error: {
    bg: 'bgRed',
    msg: ' ERROR ',
    text: 'red',
  },
  success: {
    bg: 'bgGreen',
    msg: ' DONE ',
    text: 'green',
  }
};