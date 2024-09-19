/* eslint-disable no-bitwise */
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IpcChannels } from './ipc';

export class IpcSubscription {
  public readonly channel: IpcChannels;

  public readonly subscription: any;

  public constructor(channel: IpcChannels, subscription: any) {
    this.channel = channel;
    this.subscription = subscription;
  }

  public remove() {
    ipcRenderer.removeListener(this.channel, this.subscription);
  }
}

function guidGenerator() {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

const subscriptions: Map<string, IpcSubscription> = new Map();

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: IpcChannels, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: IpcChannels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      const sub = new IpcSubscription(channel, subscription);
      const id = guidGenerator();

      subscriptions.set(id, sub);
      return id;
    },
    once(channel: IpcChannels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: IpcChannels, ...args: any[]): Promise<any> {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeListener(id: string) {
      const sub = subscriptions.get(id);
      if (sub) {
        ipcRenderer.removeListener(sub.channel, sub.subscription);
        subscriptions.delete(id);
      }
    },
    removeAllListeners(channel: IpcChannels) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
