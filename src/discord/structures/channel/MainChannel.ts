import { Client } from '../../core/client';
import { Message } from '../Message';
import BaseChannel, { ChannelType, IChannelData } from './BaseChannel';

export default class MainChannel extends BaseChannel {
  private readonly client: Client;

  private lastFetched: number;

  constructor(client: Client, data: IChannelData, messages?: Message[]) {
    super(data, messages);
    this.client = client;
    this.lastFetched = 0;
  }

  public async fetchMessages(): Promise<Message[]> {
    if (this.type !== ChannelType.GuildText) return [];

    // Retrieve and cache messages if we were not in the channel for the last 15 minutes
    if (Date.now() - this.lastFetched >= 1000 * 60 * 15) {
      console.log(
        `[Discord/Channel] Updating messages from channel '${this.id}'`,
      );
      this.messages = await this.fetchMessagesApi();
    }

    this.lastFetched = Date.now();
    return this.messages;
  }

  private async fetchMessagesApi(): Promise<Message[]> {
    if (this.type !== ChannelType.GuildText || this.client === null) return [];

    try {
      const json = await this.client.restGet(
        `/channels/${this.id}/messages?limit=50`,
      );
      if (json.message) return [];
      return json as Message[];
    } catch (err) {
      console.error(
        `[Discord/Channel] Failed to retrieve messages from channel '${this.id}': ${err}`,
      );
      return [];
    }
  }
}
