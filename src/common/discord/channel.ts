import BaseDiscordApi from './client/basediscordapi';
import { IUser, User } from './user';

export interface IconEmoji {
  name: string;
  id: any;
}

export enum ChannelType {
  GuildText = 0,
  DirectMessage = 1,
  GuildVoice = 2,
  GroupDirectMessage = 3,
  GuildCategory = 4,
  GuildAnnouncement = 5,
  AnnouncementThread = 10,
  PublicThread = 11,
  PrivateThread = 12,
  GuildStageVoice = 13,
  GuildDirectory = 14,
  GuildForum = 15,
  GuildMedia = 16,
}

export interface IChannel {
  version: number;
  type: number;
  topic: any;
  rate_limit_per_user: number;
  position: number;
  permission_overwrites: string[][];
  parent_id?: string;
  nsfw: boolean;
  name: string;
  last_pin_timestamp: string;
  last_message_id: string;
  id: string;
  icon_emoji: IconEmoji;
  flags: number;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  width: number;
  height: number;
  content_type: string;
  content_scan_version: number;
  placeholder: string;
  placeholder_version: number;
}

export interface ChannelMessage {
  type: number;
  content: string;
  mentions: User[];
  mention_roles: any[];
  attachments: Attachment[];
  embeds: string[][];
  timestamp: string;
  edited_timestamp: any;
  flags: number;
  components: any[];
  id: string;
  channel_id: string;
  author: IUser;
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
}

export default class Channel {
  public readonly id: string;

  public name: string;

  public readonly guildId: string;

  public readonly type: ChannelType;

  public readonly parentId: string | null;

  public position: number;

  public lastCheckedMessages: number = 0;

  public cachedMessages: ChannelMessage[] = [];

  public constructor(data: IChannel, guildId: string) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.parentId = data.parent_id ?? null;
    this.position = data.position;
    this.guildId = guildId;
  }

  public async getMessages(discord: BaseDiscordApi): Promise<ChannelMessage[]> {
    if (this.type !== ChannelType.GuildText) return [];

    // Retrieve and cache messages if we were not in the channel for the last 15 minutes
    if (Date.now() - this.lastCheckedMessages >= 1000 * 60 * 15) {
      console.log(
        `[Discord/Channel] Updating messages from channel '${this.id}'`,
      );
      this.cachedMessages = await this.retrieveMessages(discord);
    }

    this.lastCheckedMessages = Date.now();
    return this.cachedMessages;
  }

  private async retrieveMessages(
    discord: BaseDiscordApi,
  ): Promise<ChannelMessage[]> {
    if (this.type !== ChannelType.GuildText) return [];

    try {
      const response = await fetch(
        `https://discord.com/api/v10/channels/${this.id}/messages?limit=50`,
        {
          headers: {
            Authorization: discord.token,
          },
        },
      );
      const json = await response.json();
      if (json.message) return [];
      return json as ChannelMessage[];
    } catch (err) {
      console.error(
        `[Discord/Channel] Failed to retrieve messages from channel '${this.id}': ${err}`,
      );
      return [];
    }
  }

  public async sendMessage(content: string, discord: BaseDiscordApi) {
    if (this.type !== ChannelType.GuildText) return;

    const response = await fetch(
      `https://discord.com/api/v10/channels/${this.id}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({
          content,
          flags: 0,
          mobile_network_type: 'unknown',
          tts: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: discord.token,
        },
      },
    );
    const json = await response.json();
    console.log('Response: ', json);
  }
}
