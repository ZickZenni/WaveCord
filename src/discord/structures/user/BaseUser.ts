/* eslint-disable no-unused-vars */
import { Snowflake } from '../Snowflake';

export enum UserType {
  User,
  Bot,
  System,
}

export enum NitroType {
  None,
  NitroClassic,
  Nitro,
  NitroBasic,
}

export interface IAvatarDecorationData {
  asset: string;
  expires_at: string | null;
  sku_id: Snowflake;
}

export interface IUserData {
  id: Snowflake;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: number;
  premium_type?: NitroType;
  public_flags?: number;
  avatar_decoration_data?: IAvatarDecorationData | null;
}

export default class BaseUser {
  public readonly id: Snowflake;

  public readonly type: UserType;

  public username: string;

  public globalName: string | null;

  public discriminator: string;

  public avatar: string | null;

  public banner: string | null;

  public accentColor: number | null;

  public mfaEnabled: boolean | null;

  public locale: string | null;

  public verified: boolean | null;

  public email: string | null;

  public flags: number | null;

  public nitroType: NitroType;

  public publicFlags: number | null;

  public avatarDecorationData: IAvatarDecorationData | null;

  constructor(data: IUserData) {
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;

    if (data.system) this.type = UserType.System;
    else if (data.bot) this.type = UserType.Bot;
    else this.type = UserType.User;

    // Initializing data to default values
    this.globalName = null;
    this.avatar = null;
    this.banner = null;
    this.accentColor = null;
    this.mfaEnabled = null;
    this.locale = null;
    this.verified = null;
    this.email = null;
    this.flags = null;
    this.nitroType = NitroType.None;
    this.publicFlags = null;
    this.avatarDecorationData = null;

    this.patch(data);
  }

  /**
   * Updating the user by raw data
   * @param data The raw user data (mostly received by gateway events or rest api responses)
   */
  public patch(data: IUserData) {
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.globalName = data.global_name;
    this.avatar = data.avatar;
    this.banner = data.banner ?? this.banner;
    this.accentColor = data.accent_color ?? this.accentColor;
    this.mfaEnabled = data.mfa_enabled ?? this.mfaEnabled;
    this.locale = data.locale ?? this.locale;
    this.verified = data.verified ?? this.verified;
    this.email = data.email ?? this.email;
    this.flags = data.flags ?? this.flags;
    this.nitroType = data.premium_type ?? this.nitroType;
    this.publicFlags = data.public_flags ?? this.publicFlags;
    this.avatarDecorationData =
      data.avatar_decoration_data ?? this.avatarDecorationData;
  }

  public getAvatarUrl(): string {
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
  }

  public toRaw(): IUserData {
    return {
      id: this.id,
      username: this.username,
      discriminator: this.discriminator,
      system: this.type === UserType.System,
      bot: this.type === UserType.Bot,
      global_name: this.globalName,
      avatar: this.avatar,
      banner: this.banner,
      accent_color: this.accentColor,
      mfa_enabled: this.mfaEnabled ?? undefined,
      locale: this.locale ?? undefined,
      verified: this.verified ?? undefined,
      email: this.email,
      flags: this.flags ?? undefined,
      premium_type: this.nitroType,
      public_flags: this.publicFlags ?? undefined,
      avatar_decoration_data: this.avatarDecorationData,
    };
  }
}
