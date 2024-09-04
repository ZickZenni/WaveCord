import { CacheHolder } from '../core/cache';
import { Client } from '../core/client';
import { debug, error } from '../core/logger';
import { IChannelData } from '../structures/channel/BaseChannel';
import MainChannel from '../structures/channel/MainChannel';
import { Snowflake } from '../structures/Snowflake';

export interface GuildChannelFetchOptions {
  guildId: Snowflake;
}

export interface SingleChannelFetchOptions {
  channelId: Snowflake;
}

export class ChannelManager {
  public readonly client: Client;

  public readonly cache: CacheHolder<Snowflake, MainChannel>;

  constructor(client: Client) {
    this.client = client;
    this.cache = new CacheHolder();
  }

  public list(guildId: Snowflake): MainChannel[] {
    return this.cache.values().filter((v) => v.guildId === guildId);
  }

  public async fetch(
    options: SingleChannelFetchOptions | GuildChannelFetchOptions,
  ): Promise<MainChannel | MainChannel[] | null> {
    if ('channelId' in options) {
      // const opts = options as SingleChannelFetchOptions;

      return null;
    }

    const opts = options as GuildChannelFetchOptions;
    // Send REST request to discord and cache guilds that are returned
    try {
      const json = await this.client.restGet(
        `/guilds/${opts.guildId}/channels`,
      );

      const array = json as IChannelData[];
      const channelArray = array.map((v) => new MainChannel(this.client, v));
      // channelArray.forEach((channel) => this.cache.set(channel.id, channel));

      debug('ChannelManager', 'Fetched and cached', array.length, 'channels.');

      return channelArray;
    } catch (e) {
      error('ChannelManager', 'Failed to fetch channels:', e);
      throw new Error(`Failed to fetch channels: ${e}`);
    }
  }
}
