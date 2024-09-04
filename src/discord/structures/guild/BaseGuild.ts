/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IChannelData } from '../channel/BaseChannel';
import { Snowflake } from '../Snowflake';

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export enum DefaultMessageNotificationLevel {
  AllMessages,
  OnlyMentions,
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export enum ExplicitContentFilterLevel {
  Disabled,
  MembersWithoutRoles,
  AllMembers,
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export enum VerificationLevel {
  /**
   * Unrestricted
   */
  None,

  /**
   * Verified email on account
   */
  Low,

  /**
   * Member of the server for longer than 5 minutes
   */
  Medium,

  /**
   * Member of the server for longer than 10 minutes
   */
  High,

  /**
   * Verified phone number required
   */
  VeryHigh,
}

/**
 * https://discord.com/developers/docs/resources/guild#welcome-screen-object
 */
export enum GuildMFALevel {
  /**
   * No MFA/2FA required for moderation actions
   */
  None,

  /**
   * 2FA required for moderation actions
   */
  Elevated,
}

/**
 * https://discord.com/developers/docs/resources/guild#welcome-screen-object
 */
export enum GuildPremiumTier {
  None,
  Tier1,
  Tier2,
  Tier3,
}

/**
 * https://discord.com/developers/docs/resources/guild#unavailable-guild-object
 */
export interface IUnavailableGuild {
  id: string;
  unavailable: boolean;
}

/**
 * https://discord.com/developers/docs/resources/guild#welcome-screen-object
 */
export interface IWelcomeScreenChannel {
  channel_id: Snowflake;
  description: string;
  emoji_id: Snowflake | null;
  emoji_name: string | null;
}

/**
 * https://discord.com/developers/docs/resources/guild#welcome-screen-object
 */
export interface IWelcomeScreen {
  description: string | null;
  welcome_channels: IWelcomeScreenChannel[];
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export interface IGuildData {
  id: string;
  name: string;
  icon: string | null;
  icon_hash?: string | null;
  splash: string | null;
  discovery_splash: string | null;
  owner?: boolean;
  owner_id: Snowflake;
  permissions?: string;
  region?: string | null;
  afk_channel_id: Snowflake | null;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: Snowflake | null;
  verification_level: number;
  default_message_notifications: DefaultMessageNotificationLevel;
  explicit_content_filter: ExplicitContentFilterLevel;
  roles: any[];
  emojis: any[];
  /**
   * https://discord.com/developers/docs/resources/guild#guild-object-guild-features
   */
  features: string[];
  mfa_level: number;
  application_id: Snowflake | null;
  system_channel_id: Snowflake | null;
  system_channel_flags: number;
  rules_channel_id: Snowflake | null;
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code: string | null;
  description: string | null;
  banner: string | null;
  premium_tier: GuildPremiumTier;
  premium_subscription_count?: number | null;
  preferred_locale: string;
  public_updates_channel_id: Snowflake | null;
  max_video_channel_users?: number;
  max_stage_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: IWelcomeScreen;
  nsfw_level: number;
  stickers?: any[];
  premium_progress_bar_enabled: boolean;
  safety_alerts_channel_id: Snowflake | null;
  channels?: IChannelData[];
}

export abstract class BaseGuild {
  public readonly id: Snowflake;

  public name: string;

  public icon: string | null;

  public splash: string | null;

  public discovery_splash: string | null;

  public ownerId: Snowflake;

  public afkChannelId: Snowflake | null;

  public afkTimeout: number;

  public verificationLevel: number;

  public defaultMessageNotifications: DefaultMessageNotificationLevel;

  public explicitContentFilter: ExplicitContentFilterLevel;

  public roles: any[];

  public emojis: any[];

  public features: string[];

  public mfaLevel: number;

  public applicationId: Snowflake | null;

  public systemChannelId: Snowflake | null;

  public systemChannelFlags: number;

  public rulesChannelId: Snowflake | null;

  public vanityUrlCode: string | null;

  public description: string | null;

  public banner: string | null;

  public premiumTier: GuildPremiumTier;

  public preferredLocale: string;

  public publicUpdatesChannelId: Snowflake | null;

  public nsfwLevel: number;

  public premiumProgressBarEnabled: boolean;

  public safetyAlertsChannelId: Snowflake | null;

  constructor(data: IGuildData) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.splash = data.splash ?? null;
    this.discovery_splash = data.discovery_splash ?? null;
    this.ownerId = data.owner_id ?? null;
    this.afkChannelId = data.afk_channel_id;
    this.afkTimeout = data.afk_timeout;
    this.verificationLevel = data.verification_level;
    this.defaultMessageNotifications = data.default_message_notifications;
    this.explicitContentFilter = data.explicit_content_filter;
    this.roles = data.roles;
    this.emojis = data.emojis;
    this.features = data.features;
    this.mfaLevel = data.mfa_level;
    this.applicationId = data.application_id;
    this.systemChannelId = data.system_channel_id;
    this.systemChannelFlags = data.system_channel_flags;
    this.rulesChannelId = data.rules_channel_id;
    this.vanityUrlCode = data.vanity_url_code;
    this.description = data.description;
    this.banner = data.banner;
    this.premiumTier = data.premium_tier;
    this.preferredLocale = data.preferred_locale;
    this.publicUpdatesChannelId = data.public_updates_channel_id;
    this.nsfwLevel = data.nsfw_level;
    this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
    this.safetyAlertsChannelId = data.safety_alerts_channel_id;

    this.patch(data);
  }

  /**
   * Updating the guild by raw data or directly from discord's rest api
   * @param data The raw guild data (mostly received by gateway events or rest api responses)
   */
  public async patch(data?: IGuildData) {
    if (data) {
      this.name = data.name;
      this.icon = data.icon;
      this.splash = data.splash ?? null;
      this.discovery_splash = data.discovery_splash ?? null;
      this.ownerId = data.owner_id ?? null;
      this.afkChannelId = data.afk_channel_id;
      this.afkTimeout = data.afk_timeout;
      this.verificationLevel = data.verification_level;
      this.defaultMessageNotifications = data.default_message_notifications;
      this.explicitContentFilter = data.explicit_content_filter;
      this.roles = data.roles;
      this.emojis = data.emojis;
      this.features = data.features;
      this.mfaLevel = data.mfa_level;
      this.applicationId = data.application_id;
      this.systemChannelId = data.system_channel_id;
      this.systemChannelFlags = data.system_channel_flags;
      this.rulesChannelId = data.rules_channel_id;
      this.vanityUrlCode = data.vanity_url_code;
      this.description = data.description;
      this.banner = data.banner;
      this.premiumTier = data.premium_tier;
      this.preferredLocale = data.preferred_locale;
      this.publicUpdatesChannelId = data.public_updates_channel_id;
      this.nsfwLevel = data.nsfw_level;
      this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
      this.safetyAlertsChannelId = data.safety_alerts_channel_id;
    }

    /*
    const json = (await this.client.restGet(
      `/guilds/${this.id}?with_counts=true`,
    )) as IGuildData;
    this.patch(json);
    */
  }

  public getIconUrl(): string {
    return '';
  }

  public toRaw(): IGuildData {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      splash: this.splash,
      discovery_splash: this.discovery_splash,
      owner_id: this.ownerId,
      afk_channel_id: this.afkChannelId,
      afk_timeout: this.afkTimeout,
      verification_level: this.verificationLevel,
      default_message_notifications: this.defaultMessageNotifications,
      explicit_content_filter: this.explicitContentFilter,
      roles: this.roles,
      emojis: this.emojis,
      features: this.features,
      mfa_level: this.mfaLevel,
      application_id: this.applicationId,
      system_channel_id: this.systemChannelId,
      system_channel_flags: this.systemChannelFlags,
      rules_channel_id: this.rulesChannelId,
      vanity_url_code: this.vanityUrlCode,
      description: this.description,
      banner: this.banner,
      premium_tier: this.premiumTier,
      preferred_locale: this.preferredLocale,
      public_updates_channel_id: this.publicUpdatesChannelId,
      nsfw_level: this.nsfwLevel,
      premium_progress_bar_enabled: this.premiumProgressBarEnabled,
      safety_alerts_channel_id: this.safetyAlertsChannelId,
    };
  }
}
