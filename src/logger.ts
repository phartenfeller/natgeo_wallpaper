import * as log4js from 'log4js';
import { DateObject } from './types/DateObject';

export function createLogger(date: DateObject): log4js.Logger {
  const filename = `./logs/${date.year}-${date.month}-${date.dayOfMonth}.log`;
  log4js.configure({
    appenders: { error: { type: 'file', filename } },
    categories: { default: { appenders: ['error'], level: 'error' } }
  });
  return log4js.getLogger('error');
}
