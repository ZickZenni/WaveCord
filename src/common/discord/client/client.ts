import BaseDiscordClient from './basediscordclient';
import { GatewayClient } from '../gateway/gatewayclient';
import GatewayEvent from '../gateway/event';

export declare interface DiscordClient {
  on(event: string, listener: Function): this;

  on(event: 'connect', listener: () => void): this;

  on(event: 'event', listener: (event: GatewayEvent) => void): this;
}

// eslint-disable-next-line no-redeclare
export class DiscordClient extends BaseDiscordClient {
  public readonly gateway: GatewayClient;

  public constructor(token: string) {
    super(token);
    this.gateway = new GatewayClient(this);
    this.gateway.on('connect', () => this.emit('connect'));
    this.gateway.on('event', (event: GatewayEvent) => {
      this.emit('event', event);
    });
  }

  public disconnect() {
    this.gateway.disconnect();
  }
}
