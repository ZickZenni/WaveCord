/* eslint-disable no-bitwise */
export interface IUser {
  verified: boolean;
  username: string;
  purchased_flags: number;
  public_flags: number;
  pronouns: string;
  premium_usage_flags: number;
  premium_type: number;
  premium: boolean;
  phone: string;
  nsfw_allowed: boolean;
  mobile: boolean;
  mfa_enabled: boolean;
  id: string;
  global_name: string;
  flags: number;
  email: string;
  discriminator: string;
  desktop: boolean;
  clan: any;
  bio: string;
  banner_color: string;
  banner: string;
  avatar_decoration_data: string[];
  avatar: string | null;
  accent_color: number;
}

export class User {
  public readonly username: string;

  public nitro: boolean;

  public id: string;

  public globalName: string;

  public email: string;

  public discriminator: string;

  public bio: string;

  public banner: string;

  public avatar: string | null;

  public constructor(data: IUser | User) {
    if ((data as any).public_flags !== undefined) {
      // eslint-disable-next-line no-param-reassign
      data = data as IUser;
      this.username = data.username;
      this.nitro = data.premium;
      this.id = data.id;
      this.globalName = data.global_name ?? data.username;
      this.email = data.email;
      this.discriminator = data.discriminator;
      this.bio = data.bio;
      this.banner = data.banner;
      this.avatar = data.avatar;
    } else {
      // eslint-disable-next-line no-param-reassign
      data = data as User;
      this.username = data.username;
      this.nitro = data.nitro;
      this.id = data.id;
      this.globalName = data.globalName;
      this.email = data.email;
      this.discriminator = data.discriminator;
      this.bio = data.bio;
      this.banner = data.banner;
      this.avatar = data.avatar;
    }
  }

  public getAvatar(animated?: boolean): string {
    let defaultAvatarIndex = (Number(this.id) >> 22) % 6;

    if (defaultAvatarIndex < 0)
      defaultAvatarIndex = Number(this.discriminator) % 5;

    const url =
      this.avatar !== null
        ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;

    // Change png to gif if we want an animated version and if our user has an animated avatar available
    if (
      animated &&
      !url.includes('/embed/avatars/') &&
      this.avatar?.includes('a_')
    ) {
      return url.replace('.png', '.gif');
    }

    return url;
  }
}

export interface Member {
  user_id: string;
  user?: User;
  roles: string[];
  premium_since: any;
  pending: boolean;
  nick: string | null;
  mute: boolean;
  joined_at: string;
  flags: number;
  deaf: boolean;
  communication_disabled_until: string | null;
  banner: string | null;
  avatar: string | null;
}

export interface PrivateChannel {
  type: number;
  recipient_ids: string[];
  owner_id: string;
  name: string;
  last_message_id: string;
  id: string;
  icon: string;
  flags: number;
  blocked_user_warning_dismissed: boolean;
}

export interface Relationship {
  user_id: string;
  type: number;
  since: string;
  nickname: string | null;
  is_spam_request: boolean;
  id: string;
}

export interface ConnectedAccount {
  visibility: number;
  verified: boolean;
  type: string;
  two_way_link: boolean;
  show_activity: boolean;
  revoked: boolean;
  name: string;
  metadata_visibility: number;
  id: string;
  friend_sync: boolean;
}
