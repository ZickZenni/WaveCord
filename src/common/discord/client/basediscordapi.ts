import events from 'events';

export default class BaseDiscordApi extends events.EventEmitter {
  public readonly token: string;

  protected constructor(token: string) {
    super();
    this.token = token;
  }
}
