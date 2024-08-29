import { ipcMain, ipcRenderer } from 'electron';
import pc from 'picocolors';

const isRenderer = process && process.type === 'renderer';

function handleLog(fromRenderer: boolean, ...args: any[]) {
  const level = args.shift();
  const prefix = fromRenderer ? pc.red('renderer') : `    ${pc.green('main')}`;
  const messages: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (typeof arg !== 'object') {
      messages.push(arg);
      continue;
    }

    messages.push(JSON.stringify(arg));
  }

  console.log(
    `   ${prefix} ${pc.gray('/')} ${level} ${pc.gray('>')} ${messages.join(' ')}`,
  );
}

function init() {
  ipcMain.on('LOGGER__LOG', (_, ...args: any[]) => {
    handleLog(true, ...args);
  });
}

function internalLog(level: string, ...args: any[]) {
  if (isRenderer) ipcRenderer.send('LOGGER__LOG', level, ...args);
  else handleLog(false, level, ...args);
}

function log(...args: any[]) {
  internalLog('info', ...args);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function info(...args: any[]) {
  internalLog('info', ...args);
}

function warn(...args: any[]) {
  internalLog('warn', ...args);
}

function error(...args: any[]) {
  internalLog('error', ...args);
}

export default {
  init,
  log,
  warn,
  error,
};
