import { Message } from '../Message';
import BaseChannel from './BaseChannel';

export default class RendererChannel extends BaseChannel {
  public async fetchMessages(): Promise<Message[]> {
    return window.electron.ipcRenderer.invoke(
      'discord:fetch-messages',
      this.id,
    );
  }
}
