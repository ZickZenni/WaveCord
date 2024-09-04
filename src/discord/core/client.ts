import { TypedEmitter } from 'tiny-typed-emitter';
import { WebSocket } from 'ws';
import { Gateway } from '../ws/gateway';
import { GatewayReadyDispatchData, GatewaySocketEvent } from '../ws/types';
import { debug, setDebugging } from './logger';
import { GuildManager } from '../managers/GuildManager';
import { ChannelManager } from '../managers/ChannelManager';
import MainGuild from '../structures/guild/MainGuild';
import MainChannel from '../structures/channel/MainChannel';
import MainUser from '../structures/user/MainUser';

export interface ClientEvents {
  ready: () => void;
  // eslint-disable-next-line no-unused-vars
  dispatch: (event: GatewaySocketEvent) => void;
}

export interface ClientOptions {
  debug?: boolean;
}

export class Client extends TypedEmitter<ClientEvents> {
  public readonly options: ClientOptions;

  public readonly gateway: Gateway;

  public readonly guilds: GuildManager;

  public readonly channels: ChannelManager;

  public user: MainUser | null;

  private token: string;

  constructor(options?: ClientOptions) {
    super();
    this.options = options ?? {};

    if (this.options.debug) setDebugging(this.options.debug);

    this.gateway = new Gateway({ apiVersion: 10, encoding: 'json' });
    this.gateway.on('dispatch', async (event) => {
      if (event.event === 'READY') {
        const data = event.data as GatewayReadyDispatchData;

        // Cache all guilds
        data.guilds.forEach((guildData) => {
          this.guilds.cache.set(guildData.id, new MainGuild(guildData));

          // Check if the guild data has channels in it
          if (guildData.channels) {
            // Cache all channels
            guildData.channels.forEach((channelData) => {
              // Somehow this data doesn't include a guild id
              channelData.guild_id = guildData.id;

              // Cache this son of a bitch
              this.channels.cache.set(
                channelData.id,
                new MainChannel(this, channelData),
              );
            });
          }
        });
        this.user = new MainUser(data.user);

        debug(
          'Client',
          "Client received 'Ready' dispatch event and is now ready to use!",
        );
        this.emit('ready');
      }
      this.emit('dispatch', event);
    });
    this.guilds = new GuildManager(this);
    this.channels = new ChannelManager(this);
    this.user = null;
    this.token = '';
  }

  /**
   * Logins and connects to the discord api and gateway.
   * @param token A valid discord authentication token
   */
  public async login(token: string): Promise<void> {
    if (!this.validateToken(token))
      throw new Error('Failed to login: Invalid discord token.');

    this.token = token;
    this.gateway.setToken(token);

    // Connect to discord's gateway
    await this.gateway.connect();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async restGet(path: string): Promise<any> {
    const url = `https://discord.com/api/v10${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: this.token,
      },
    });
    const json = await response.json();
    return json;
  }

  /**
   * Validates if a authentication token is good for discord.
   * @param token A authentication token
   */
  public validateToken(token: string): boolean {
    if (token.length !== 70) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const userId = Buffer.from(parts[0], 'base64').toString('utf8');
    return (
      (userId.length === 17 || userId.length === 18) &&
      !Number.isNaN(Number(userId))
    );
  }

  public isConnected(): boolean {
    return (
      this.gateway.socket !== null &&
      this.gateway.socket.readyState === WebSocket.OPEN
    );
  }
}
