import { configure, getLogger, Logger } from 'log4js';
import { DateObject } from './types/DateObject';

const file = 'file';

export function createLogger(date: DateObject): Logger {
  const filename = `./logs/${date.year}-${date.month}-${date.dayOfMonth}.log`;
  configure({
    appenders: { file: { type: 'file', filename } },
    categories: { default: { appenders: [file], level: 'debug' } }
  });
  return getLogger(file);
}
