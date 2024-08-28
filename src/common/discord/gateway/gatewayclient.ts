import WebSocket from 'ws';
import events from 'events';
import BaseDiscordClient from '../client/basediscordclient';
import GatewayEvent from './event';
import { VoiceState } from '../voice';
import { ReadyEventData } from './data/ReadyEventData';
import { Guild } from '../guild';
import Channel, { ChannelMessage } from '../channel';
import { User } from '../user';

export declare interface GatewayClient {
  on(event: string, listener: Function): this;

  on(event: 'connect', listener: () => void): this;

  on(event: 'event', listener: (event: GatewayEvent) => void): this;
}

// eslint-disable-next-line no-redeclare
export class GatewayClient extends events.EventEmitter {
  private readonly discord: BaseDiscordClient;

  private websocket: WebSocket | null = null;

  private heartbeat: number = 30000;

  public constructor(discord: BaseDiscordClient) {
    super();
    this.discord = discord;
    this.connect();
  }

  public sendEvent(event: GatewayEvent) {
    if (this.websocket?.readyState !== WebSocket.OPEN) return;

    const data = {
      op: event.op,
      d: event.data,
      s: event.sequence,
      t: event.event,
    };
    this.websocket.send(JSON.stringify(data));
  }

  public connect(): boolean {
    if (this.websocket !== null) return false;

    this.websocket = new WebSocket(
      'wss://gateway.discord.gg/?v=10&encoding=json',
    );
    this.websocket.on('open', () => {
      this.sendEvent({
        op: 2,
        data: {
          token: this.discord.token,
          capabilities: 4605,
          properties: {
            os: 'windows',
            browser: 'chrome',
            device: 'windows',
          },
        },
      });
    });
    this.websocket.on('message', (message) => {
      const raw = message.toString();
      const json = JSON.parse(raw);

      const event: GatewayEvent = {
        op: json.op,
        data: json.d,
        sequence: json.s,
        event: json.t,
      };

      this.handleEvent(event);
    });
    this.websocket.on('close', (code, reason) => {
      console.log(
        `[WaveCord/Gateway] Disconnected (${code}, ${reason}). Reconnecting...`,
      );
      this.websocket = null;
      this.connect();
    });
    return true;
  }

  public disconnect(): boolean {
    if (this.websocket === null) return false;

    this.websocket.close();
    this.websocket = null;
    return true;
  }

  private handleEvent(event: GatewayEvent) {
    if (event.op === 0) {
      switch (event.event) {
        case 'READY':
          this.handleReadyEvent(event);
          break;
        case 'READY_SUPPLEMENTAL':
          this.emit('connect');
          break;
        case 'VOICE_STATE_UPDATE':
          this.handleVoiceStateUpdateEvent(event);
          break;
        case 'MESSAGE_CREATE':
          this.handleMessageCreateEvent(event);
          break;
        default:
          break;
      }
    }

    if (event.op === 10) {
      this.heartbeat = event.data.heartbeat_interval as number;
      setInterval(() => {
        this.sendEvent({
          op: 1,
          data: null,
        });
      }, this.heartbeat);
    }
    this.emit('event', event);
  }

  private handleReadyEvent(event: GatewayEvent) {
    const data = event.data as ReadyEventData;

    for (let i = 0; i < data.users.length; i += 1) {
      const iuser = data.users[i];
      this.discord.users.setUser(new User(iuser));
    }

    // Adding members to guild
    for (let index = 0; index < data.merged_members.length; index += 1) {
      const members = data.merged_members[index];
      const guild = data.guilds[index];

      if (guild !== undefined) {
        if (guild.members === undefined) guild.members = [...members];
        else guild.members.push(...members);
      }
    }

    // Adding guilds to our guild service
    for (let i = 0; i < data.guilds.length; i += 1) {
      const iguild = data.guilds[i];
      const guild = new Guild(iguild);

      if (iguild.channels !== undefined) {
        for (let j = 0; j < iguild.channels.length; j += 1) {
          const ichannel = iguild.channels[j];
          guild.channels.push(new Channel(ichannel, guild.id));
        }
      }

      this.discord.guilds.addGuild(guild);
    }

    this.discord.privateChannels = data.private_channels;
    this.discord.relationships = data.relationships;
    this.discord.selfUser = new User(data.user);
  }

  private handleVoiceStateUpdateEvent(event: GatewayEvent) {
    const voiceState = event.data as VoiceState;
    this.discord.voice.setVoiceState(voiceState.user_id, voiceState);
  }

  private handleMessageCreateEvent(event: GatewayEvent) {
    const message = event.data as ChannelMessage;
    const channel = this.discord.getChannel(message.channel_id);

    if (channel === null) return;

    // Check if message is not cached
    if (channel.cachedMessages.find((v) => v.id === message.id) === undefined)
      channel.cachedMessages.push(message);
  }

  public getWebSocket(): WebSocket | null {
    return this.websocket;
  }
}
