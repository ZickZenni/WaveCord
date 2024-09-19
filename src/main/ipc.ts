import { BrowserWindow, ipcMain } from 'electron';

export type IpcChannels =
  | 'logger:info'
  | 'logger:warn'
  | 'logger:error'
  | 'logger:crit'
  | 'logger:debug'
  | 'window:minimize'
  | 'window:maximize'
  | 'app:exit'
  | 'discord:ready'
  | 'discord:guilds'
  | 'discord:channels'
  | 'discord:load-channel'
  | 'discord:fetch-messages'
  | 'discord:fetch-guild'
  | 'discord:user'
  | 'discord:get-last-visited-channel'
  | 'discord:set-last-visited-channel'
  | 'discord:create-message'
  | 'discord:gateway:message-create'
  | 'discord:relationships'
  | 'discord:private-channels'
  | 'tenor:fetch-gif';

export function registerHandler(
  channel: IpcChannels,
  func: (...args: any[]) => any,
) {
  ipcMain.handle(channel, (_, ...args: any[]) => {
    return func(...args);
  });
}

export function registerListener(
  channel: IpcChannels,
  func: (...args: any[]) => void,
) {
  ipcMain.on(channel, (_, ...args: any[]) => {
    func(...args);
  });
}

export function sendToRenderer(
  window: BrowserWindow,
  channel: IpcChannels,
  ...args: any[]
) {
  window.webContents.send(channel, ...args);
}
