import { Member } from './user';
import Channel, { IChannel } from './channel';

export interface Tags {
  bot_id: string;
}

export interface Role {
  version: number;
  unicode_emoji: any;
  tags: Tags;
  position: number;
  permissions: string;
  name: string;
  mentionable: boolean;
  managed: boolean;
  id: string;
  icon: any;
  hoist: boolean;
  flags: number;
  color: number;
}

export interface SoundboardSound {
  volume: number;
  user_id: string;
  sound_id: string;
  name: string;
  guild_id: string;
  emoji_name: string;
  emoji_id: any;
  available: boolean;
}

export interface ApplicationCommandCounts {}

export interface IGuild {
  members: Member[];
  member_count: number;
  incidents_data: any;
  explicit_content_filter: number;
  stage_instances: any[];
  rules_channel_id: any;
  nsfw_level: number;
  owner_id: string;
  discovery_splash: any;
  embedded_activities: any[];
  preferred_locale: string;
  verification_level: number;
  nsfw: boolean;
  icon: string;
  default_message_notifications: number;
  vanity_url_code: any;
  id: string;
  afk_channel_id: any;
  name: string;
  splash: any;
  features: string[];
  latest_onboarding_question_id: any;
  emojis: any[];
  max_stage_video_channel_users: number;
  lazy: boolean;
  system_channel_id: string;
  threads: any[];
  max_video_channel_users: number;
  application_id: any;
  guild_scheduled_events: string[][];
  description: any;
  activity_instances: any[];
  large: boolean;
  inventory_settings: any;
  application_command_counts: ApplicationCommandCounts;
  premium_subscription_count: number;
  clan: any;
  hub_type: any;
  roles: Role[];
  home_header: any;
  mfa_level: number;
  public_updates_channel_id: any;
  region: string;
  voice_states: any[];
  max_members: number;
  safety_alerts_channel_id: any;
  channels: IChannel[];
  soundboard_sounds: SoundboardSound[];
  premium_tier: number;
  stickers: any[];
  afk_timeout: number;
  version: number;
  presences: any[];
  joined_at: string;
  system_channel_flags: number;
  premium_progress_bar_enabled: boolean;
  banner?: string;
}

export class Guild {
  public readonly id: string;

  public name: string;

  public channels: Channel[];

  public members: Member[];

  public banner: string | null;

  public icon: string | null;

  public constructor(data: IGuild) {
    this.id = data.id;
    this.name = data.name;
    this.banner = data.banner ?? null;
    this.icon = data.icon ?? null;
    this.channels = [];
    this.members = [];
  }
}
