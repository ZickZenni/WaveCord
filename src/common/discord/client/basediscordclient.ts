import VoiceService from '../service/voiceservice';
import GuildService from '../service/guildservice';
import { PrivateChannel, Relationship, User } from '../user';
import Channel from '../channel';
import UserService from '../service/userservice';
import BaseDiscordApi from './basediscordapi';

export default abstract class BaseDiscordClient extends BaseDiscordApi {
  public readonly voice: VoiceService;

  public readonly guilds: GuildService;

  public readonly users: UserService;

  public selfUser: User | null = null;

  public relationships: Relationship[] = [];

  public privateChannels: PrivateChannel[] = [];

  public ready: boolean = false;

  protected constructor(token: string) {
    super(token);
    this.voice = new VoiceService();
    this.guilds = new GuildService();
    this.users = new UserService();
  }

  public getChannel(id: string): Channel | null {
    const guilds = this.guilds.getGuilds();
    for (let i = 0; i < guilds.length; i += 1) {
      const guild = guilds[i];
      for (let j = 0; j < guild.channels.length; j += 1) {
        const channel = guild.channels[j];
        if (channel.id === id) return channel;
      }
    }
    return null;
  }
}
