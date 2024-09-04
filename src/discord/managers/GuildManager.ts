import { CacheHolder } from '../core/cache';
import { Client } from '../core/client';
import { debug, error } from '../core/logger';
import { Snowflake } from '../structures/Snowflake';
import { IGuildData } from '../structures/guild/BaseGuild';
import MainGuild from '../structures/guild/MainGuild';

export interface BaseGuildFetchOptions {
  skipCache?: boolean;
}

export interface SingleGuildFetchOptions extends BaseGuildFetchOptions {
  id: string;
}

export interface MultiGuildFetchOptions extends BaseGuildFetchOptions {
  lowest: string;
  highest: string;
}

export class GuildManager {
  private readonly client: Client;

  public readonly cache: CacheHolder<Snowflake, MainGuild>;

  constructor(client: Client) {
    this.client = client;
    this.cache = new CacheHolder();
  }

  /**
   * Fetches one or multiple guilds either from cache or directly from discord
   * @param {SingleGuildFetchOptions | MultiGuildFetchOptions} options Options for the fetching, either single or multi
   */
  public async fetch(
    options: SingleGuildFetchOptions | MultiGuildFetchOptions,
  ): Promise<MainGuild | MainGuild[] | null> {
    // Single Guild Fetch
    if ('id' in options) {
      const opts = options as SingleGuildFetchOptions;

      debug('GuildManager', 'Fetching single guild', opts.id);

      return null;
    }

    // Multi Guild Fetch
    const opts = options as MultiGuildFetchOptions;

    debug(
      'GuildManager',
      'Fetching multiple guilds from',
      opts.lowest,
      'to',
      opts.highest,
    );

    // Send REST request to discord and cache guilds that are returned
    try {
      const json = await this.client.restGet(
        `/users/@me/guilds?after=${opts.lowest}&before=${opts.highest}&with_counts=true`,
      );

      const array = json as IGuildData[];
      const guildArray = array.map((v) => new MainGuild(v));
      guildArray.forEach((guild) => this.cache.set(guild.id, guild));

      debug('GuildManager', 'Fetched and cached', array.length, 'guilds.');

      return guildArray;
    } catch (e) {
      error('Failed to fetch guilds:', e);
      throw new Error(`Failed to fetch guilds: ${e}`);
    }
  }
}
