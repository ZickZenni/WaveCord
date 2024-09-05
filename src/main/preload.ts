/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import moment from 'moment';
import picocolors from 'picocolors';
import { IpcChannels } from './ipc';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: IpcChannels, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: IpcChannels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: IpcChannels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: IpcChannels, ...args: any[]): Promise<any> {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

const loggerHandler = {
  info(...args: any[]) {
    console.log(
      picocolors.gray(moment().format('hh:mm:ss')),
      '| Info |',
      ...args,
    );
    ipcRenderer.send('logger:info', ...args);
  },
  warn(...args: any[]) {
    console.log(
      picocolors.gray(moment().format('hh:mm:ss')),
      '| Warn |',
      ...args,
    );
    ipcRenderer.send('logger:warn', ...args);
  },
  error(...args: any[]) {
    console.log(
      picocolors.gray(moment().format('hh:mm:ss')),
      '| Error |',
      ...args,
    );
    ipcRenderer.send('logger:error', ...args);
  },
  crit(...args: any[]) {
    console.log(
      picocolors.gray(moment().format('hh:mm:ss')),
      '| Crit |',
      ...args,
    );
    ipcRenderer.send('logger:crit', ...args);
  },
  debug(...args: any[]) {
    console.log(
      picocolors.gray(moment().format('hh:mm:ss')),
      '| Debug |',
      ...args,
    );
    ipcRenderer.send('logger:debug', ...args);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
contextBridge.exposeInMainWorld('logger', loggerHandler);

export type LoggerHandler = typeof loggerHandler;
export type ElectronHandler = typeof electronHandler;
