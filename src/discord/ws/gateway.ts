import { TypedEmitter } from 'tiny-typed-emitter';
import WebSocket from 'ws';
import {
  GatewayEvents,
  GatewayHelloEventData,
  GatewayOpcodes,
  GatewaySocketEvent,
} from './types';
import { debug } from '../core/logger';

export interface GatewayOptions {
  apiVersion: number;
  encoding: 'json' | 'etf';
}

export class Gateway extends TypedEmitter<GatewayEvents> {
  public readonly options: GatewayOptions;

  public socket: WebSocket | null;

  private token: string;

  private sequence: number;

  private heartbeatInterval: number;

  private heartbeat: ReturnType<typeof setInterval> | undefined;

  constructor(options: GatewayOptions) {
    super();
    this.options = options;
    this.socket = null;
    this.token = '';
    this.sequence = 0;
    this.heartbeatInterval = 0;
    this.heartbeat = undefined;
  }

  /**
   * Connects to the discord gateway.
   */
  public async connect(): Promise<void> {
    // Throw error if we are already connected to the gateway
    if (this.socket !== null)
      throw new Error(
        'Failed to connect to gateway: A connection is already established.',
      );

    // Reset variables from gateway
    this.sequence = 0;
    this.heartbeatInterval = 0;

    clearTimeout(this.heartbeat);
    this.heartbeat = undefined;

    // Create new websocket connection to the discord gateway
    this.socket = new WebSocket(
      `wss://gateway.discord.gg/?v=${this.options.apiVersion}&encoding=${this.options.encoding}`,
    );
    debug('Gateway', 'Connecting to gateway:', this.socket.url);

    this.socket.on('open', () => {
      debug('Gateway', 'Successfully opened connection. Identifying now...');
      // We identify ourselfes to discord
      this.send({
        op: GatewayOpcodes.Identify,
        data: {
          token: this.token,
          capabilities: 4605,
          properties: {
            os: 'windows',
            browser: 'chrome',
            device: 'windows',
          },
        },
      });
    });

    this.socket.on('close', (code, reason) => {
      clearTimeout(this.heartbeat);
      this.heartbeat = undefined;
      throw new Error(
        `Failed to connect to gateway: ${code}, ${reason.toString('utf8')}`,
      );
    });

    this.socket.on('message', (data) => {
      // Todo: Add support for etf
      if (this.options.encoding === 'etf') return;

      // Convert raw data into a readable utf8 string
      const message = data.toString('utf8');

      try {
        // Parse message into a json object
        const json = JSON.parse(message);

        const event: GatewaySocketEvent = {
          op: json.op,
          data: json.d,
          sequence: json.s,
          event: json.t,
        };

        this.sequence = event.sequence ?? this.sequence;
        this.handleEvent(event);
      } catch (e) {
        console.error('Failed to parse gateway message:', e);
      }
    });
  }

  /**
   * Sends a event to the discord gateway.
   * @param event The event with data
   */
  public send(event: GatewaySocketEvent) {
    if (this.socket === null)
      throw new Error(
        'Failed to send event to gateway: A connection is non existent.',
      );

    if (this.socket.readyState !== WebSocket.OPEN)
      throw new Error('Failed to send event to gateway: Socket is not ready.');

    debug('Gateway', 'Sending event with opcode', GatewayOpcodes[event.op]);
    this.socket.send(
      JSON.stringify({
        op: event.op,
        d: event.data,
        s: event.sequence,
        t: event.event,
      }),
    );
  }

  /**
   * Sets the token for identifying.
   */
  public setToken(token: string) {
    this.token = token;
  }

  /**
   * Handles a gateway socket event. (includes dispatch events)
   */
  private handleEvent(event: GatewaySocketEvent) {
    switch (event.op) {
      case GatewayOpcodes.Dispatch:
        this.emit('dispatch', event);
        break;

      case GatewayOpcodes.Hello: {
        const data = event.data as GatewayHelloEventData;
        this.heartbeatInterval = data.heartbeat_interval;
        this.heartbeat = setInterval(
          () =>
            this.send({
              op: GatewayOpcodes.Heartbeat,
              data: this.sequence,
            }),
          this.heartbeatInterval,
        );
        break;
      }
      default:
        break;
    }
  }
}
