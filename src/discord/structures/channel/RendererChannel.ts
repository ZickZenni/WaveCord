import { Message } from '../Message';
import BaseChannel, { CreateMessageOptions } from './BaseChannel';

export default class RendererChannel extends BaseChannel {
  public async fetchMessages(): Promise<Message[]> {
    return window.electron.ipcRenderer.invoke(
      'discord:fetch-messages',
      this.id,
    );
  }

  public async createMessage(
    options: CreateMessageOptions,
  ): Promise<Message | null> {
    return window.electron.ipcRenderer.invoke(
      'discord:create-message',
      this.id,
      options,
    );
  }
}
