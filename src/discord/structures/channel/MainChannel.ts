import logger from '../../../common/log/logger';
import { Client } from '../../core/client';
import { Message } from '../Message';
import BaseChannel, {
  ChannelType,
  CreateMessageOptions,
  IChannelData,
} from './BaseChannel';

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

  public async createMessage(
    options: CreateMessageOptions,
  ): Promise<Message | null> {
    if (this.type !== ChannelType.GuildText) return null;

    options.content ??= '';
    options.components ??= [];
    options.embeds ??= [];
    options.files ??= [];
    options.sticker_ids ??= [];

    try {
      const json = await this.client.restPost(
        `/channels/${this.id}/messages`,
        options,
      );
      if (json.message) return null;

      const message = json as Message;
      this.messages.unshift(message);
      return message;
    } catch (err) {
      logger.error(
        `[Discord/Channel] Failed to create message in channel '${this.id}': ${err}`,
      );
      return null;
    }
  }

  /* --------------------------- */

  private async fetchMessagesApi(): Promise<Message[]> {
    if (this.type !== ChannelType.GuildText || this.client === null) return [];

    try {
      const json = await this.client.restGet(
        `/channels/${this.id}/messages?limit=50`,
      );
      if (json.message) return [];
      return json as Message[];
    } catch (err) {
      logger.error(
        `[Discord/Channel] Failed to retrieve messages from channel '${this.id}': ${err}`,
      );
      return [];
    }
  }
}
