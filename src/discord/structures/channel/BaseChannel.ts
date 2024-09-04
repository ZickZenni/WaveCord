import { Message } from '../Message';
import { Snowflake } from '../Snowflake';

/**
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-types
 */
export enum ChannelType {
  GuildText,
  DirectMessage,
  GuildVoice,
  GroupDM,
  GuildCategory,
  GuildAnnouncement,
  AnnouncementThread,
  PublicThread,
  PrivateThread,
  GuildStageVoice,
  GuildDirectory,
  GuildForum,
  GuildMedia,
}

/**
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
 */
export interface IChannelData {
  id: Snowflake;
  type: ChannelType;
  guild_id?: Snowflake;
  position?: number;
  name?: string | null;
  /**
   * 0-4096 characters for GuildForum and GuildMedia, 0-1024 characters for all others
   */
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: Snowflake | null;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  icon?: string | null;
  owner_id?: Snowflake;
  application_id?: Snowflake;
  managed?: boolean;
  parent_id?: Snowflake | null;
  last_pin_timestamp?: string | null;
  rtc_region?: string | null;
  video_quality_mode?: number;
  message_count?: number;
  member_count?: number;
  default_auto_archive_duration?: number;
  permissions?: string;
  flags?: number;
  total_message_sent?: number;
}

/* eslint-disable class-methods-use-this */
export default abstract class BaseChannel {
  public readonly id: Snowflake;

  public readonly type: ChannelType;

  public readonly guildId: Snowflake | null;

  public position: number;

  public name: string;

  public parentId: Snowflake | null;

  public messages: Message[];

  constructor(data: IChannelData, messages?: Message[]) {
    this.id = data.id;
    this.type = data.type;
    this.guildId = data.guild_id ?? null;
    this.position = data.position ?? 0;
    this.name = data.name ?? '';
    this.parentId = data.parent_id ?? null;
    this.messages = messages ?? [];

    this.patch(data);
  }

  /**
   * Updating the channel by raw data or directly from discord's rest api
   * @param data The raw channel data (mostly received by gateway events or rest api responses)
   */
  public async patch(data?: IChannelData) {
    if (data) {
      this.position = data.position ?? 0;
      this.name = data.name ?? '';
      this.parentId = data.parent_id ?? null;
    }
  }

  /**
   * Fetches messages from the channel
   * @returns Messages from the channel
   */
  public abstract fetchMessages(): Promise<Message[]>;

  /**
   * Converts the class back into a raw data object
   */
  public toRaw(): IChannelData {
    return {
      id: this.id,
      type: this.type,
      guild_id: this.guildId ? this.guildId : undefined,
      position: this.position,
      name: this.name,
      parent_id: this.parentId,
    };
  }
}
