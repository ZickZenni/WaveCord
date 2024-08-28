import { Guild } from '../guild';

export default class GuildService {
  private guilds: Guild[];

  public constructor() {
    this.guilds = [];
  }

  public addGuild(guild: Guild) {
    if (this.guilds.find((value) => value.id === guild.id) !== undefined)
      return;
    this.guilds.push(guild);
  }

  public removeGuild(guildId: string) {
    this.guilds = this.guilds.filter((guild: Guild) => guild.id !== guildId);
  }

  public getGuilds(): Guild[] {
    return this.guilds;
  }
}
