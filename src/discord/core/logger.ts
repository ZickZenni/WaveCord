/* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
import pico from 'picocolors';

export enum LogType {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Critical = 'crit',
  Debug = 'debug',
}

let sequence = 1;

function handleArgs(...args: any[]): string {
  const messages: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (typeof arg !== 'object') {
      messages.push(arg);
      continue;
    }

    messages.push(JSON.stringify(arg, null, 4));
  }
  return messages.join(' ');
}

function handleMessage(logType: LogType, ...args: any[]): string {
  const message = handleArgs(...args);

  switch (logType) {
    case LogType.Info:
      return pico.blue(message);
    case LogType.Warn:
      return pico.yellow(message);
    case LogType.Error:
      return pico.red(message);
    case LogType.Critical:
      return pico.bgRed(message);
    case LogType.Debug:
      return pico.green(message);
    default:
      return message;
  }
}

function log(logger: string, logType: LogType, ...args: any[]) {
  const now = new Date();

  const date = `${now.getUTCFullYear()}-${now.getUTCMonth().toString().padStart(2, '0')}-${now.getUTCDate().toString().padStart(2, '0')}`;
  const time = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}:${now.getUTCSeconds().toString().padStart(2, '0')}`;

  const message = handleMessage(logType, ...args);

  console.log(
    `${pico.cyan(logger.padEnd(16, ' '))} ${pico.gray(`${date} ${time}`)} ${pico.blue(sequence.toString().padStart(5, ' '))} ${message}`,
  );

  sequence += 1;
}

let debugging = false;

export function setDebugging(state: boolean) {
  debugging = state;
}

export function info(logger: string, ...args: any[]) {
  log(logger, LogType.Info, ...args);
}

export function warn(logger: string, ...args: any[]) {
  log(logger, LogType.Warn, ...args);
}

export function error(logger: string, ...args: any[]) {
  log(logger, LogType.Error, ...args);
}

export function crit(logger: string, ...args: any[]) {
  log(logger, LogType.Critical, ...args);
}

export function debug(logger: string, ...args: any[]) {
  if (debugging) log(logger, LogType.Debug, ...args);
}
