import { IGuild } from '../../guild';
import {
  ConnectedAccount,
  IUser,
  Member,
  PrivateChannel,
  Relationship,
} from '../../user';
import { VoiceState } from '../../voice';

export interface Consents {
  personalization: string[];
}

export interface NotificationSettings {
  flags: number;
}

export interface UserSettings {
  detect_platform_accounts: boolean;
  animate_stickers: number;
  inline_attachment_media: boolean;
  status: string;
  message_display_compact: boolean;
  view_nsfw_guilds: boolean;
  timezone_offset: number;
  enable_tts_command: boolean;
  disable_games_tab: boolean;
  stream_notifications_enabled: boolean;
  animate_emoji: boolean;
  guild_folders: string[];
  activity_joining_restricted_guild_ids: any[];
  friend_source_flags: string[];
  broadcast_allowed_user_ids: any[];
  convert_emoticons: boolean;
  afk_timeout: number;
  passwordless: boolean;
  contact_sync_enabled: boolean;
  broadcast_allow_friends: boolean;
  gif_auto_play: boolean;
  custom_status: any;
  native_phone_integration_enabled: boolean;
  allow_accessibility_detection: boolean;
  broadcast_allowed_guild_ids: any[];
  friend_discovery_flags: number;
  show_current_game: boolean;
  restricted_guilds: any[];
  developer_mode: boolean;
  view_nsfw_commands: boolean;
  render_reactions: boolean;
  locale: string;
  render_embeds: boolean;
  inline_embed_media: boolean;
  default_guilds_restricted: boolean;
  explicit_content_filter: number;
  activity_restricted_guild_ids: any[];
  theme: string;
}

export interface ReadyEventData {
  v: number;
  user_settings_proto: string;
  user_settings: UserSettings;
  user_guild_settings: string[][];
  user: IUser;
  users: IUser[];
  relationships: Relationship[];
  read_state: string[][];
  private_channels: PrivateChannel[];
  presences: string[][];
  notification_settings: NotificationSettings;
  guilds: IGuild[];
  merged_members: Member[][];
  guild_join_requests: any[];
  guild_experiments: string[][];
  friend_suggestion_count: number;
  explicit_content_scan_version: number;
  experiments: string[][];
  country_code: string;
  consents: Consents;
  connected_accounts: ConnectedAccount[];
  auth_session_id_hash: string;
  api_code_version: number;
  analytics_token: string;
}

export interface MergedPresences {
  guilds: any[];
  friends: any[];
}

export interface SupplementalGuild {
  voice_states: VoiceState[];
  id: string;
  embedded_activities: any[];
  activity_instances: any[];
}

export interface ReadySupplementalData {
  merged_presences: MergedPresences;
  merged_members: any[];
  lazy_private_channels: any[];
  guilds: SupplementalGuild[];
  game_invites: any[];
  disclose: string[];
}
