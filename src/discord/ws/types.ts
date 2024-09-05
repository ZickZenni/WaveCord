/* eslint-disable no-unused-vars */

import { IGuildData } from '../structures/guild/BaseGuild';
import { Relationship } from '../structures/Relationship';
import { IUserData } from '../structures/user/BaseUser';

export enum GatewayOpcodes {
  Dispatch,
  Heartbeat,
  Identify,
  Hello = 10,
}

/**
 * https://discord.com/developers/docs/topics/gateway-events#receive-events
 */
export enum GatewayDispatchEvents {
  ApplicationCommandPermissionsUpdate = 'APPLICATION_COMMAND_PERMISSIONS_UPDATE',
  ChannelCreate = 'CHANNEL_CREATE',
  ChannelDelete = 'CHANNEL_DELETE',
  ChannelPinsUpdate = 'CHANNEL_PINS_UPDATE',
  ChannelUpdate = 'CHANNEL_UPDATE',
  GuildBanAdd = 'GUILD_BAN_ADD',
  GuildBanRemove = 'GUILD_BAN_REMOVE',
  GuildCreate = 'GUILD_CREATE',
  GuildDelete = 'GUILD_DELETE',
  GuildEmojisUpdate = 'GUILD_EMOJIS_UPDATE',
  GuildIntegrationsUpdate = 'GUILD_INTEGRATIONS_UPDATE',
  GuildMemberAdd = 'GUILD_MEMBER_ADD',
  GuildMemberRemove = 'GUILD_MEMBER_REMOVE',
  GuildMembersChunk = 'GUILD_MEMBERS_CHUNK',
  GuildMemberUpdate = 'GUILD_MEMBER_UPDATE',
  GuildRoleCreate = 'GUILD_ROLE_CREATE',
  GuildRoleDelete = 'GUILD_ROLE_DELETE',
  GuildRoleUpdate = 'GUILD_ROLE_UPDATE',
  GuildStickersUpdate = 'GUILD_STICKERS_UPDATE',
  GuildUpdate = 'GUILD_UPDATE',
  IntegrationCreate = 'INTEGRATION_CREATE',
  IntegrationDelete = 'INTEGRATION_DELETE',
  IntegrationUpdate = 'INTEGRATION_UPDATE',
  InteractionCreate = 'INTERACTION_CREATE',
  InviteCreate = 'INVITE_CREATE',
  InviteDelete = 'INVITE_DELETE',
  MessageCreate = 'MESSAGE_CREATE',
  MessageDelete = 'MESSAGE_DELETE',
  MessageDeleteBulk = 'MESSAGE_DELETE_BULK',
  MessageReactionAdd = 'MESSAGE_REACTION_ADD',
  MessageReactionRemove = 'MESSAGE_REACTION_REMOVE',
  MessageReactionRemoveAll = 'MESSAGE_REACTION_REMOVE_ALL',
  MessageReactionRemoveEmoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
  MessageUpdate = 'MESSAGE_UPDATE',
  PresenceUpdate = 'PRESENCE_UPDATE',
  StageInstanceCreate = 'STAGE_INSTANCE_CREATE',
  StageInstanceDelete = 'STAGE_INSTANCE_DELETE',
  StageInstanceUpdate = 'STAGE_INSTANCE_UPDATE',
  Ready = 'READY',
  Resumed = 'RESUMED',
  ThreadCreate = 'THREAD_CREATE',
  ThreadDelete = 'THREAD_DELETE',
  ThreadListSync = 'THREAD_LIST_SYNC',
  ThreadMembersUpdate = 'THREAD_MEMBERS_UPDATE',
  ThreadMemberUpdate = 'THREAD_MEMBER_UPDATE',
  ThreadUpdate = 'THREAD_UPDATE',
  TypingStart = 'TYPING_START',
  UserUpdate = 'USER_UPDATE',
  VoiceServerUpdate = 'VOICE_SERVER_UPDATE',
  VoiceStateUpdate = 'VOICE_STATE_UPDATE',
  WebhooksUpdate = 'WEBHOOKS_UPDATE',
  MessagePollVoteAdd = 'MESSAGE_POLL_VOTE_ADD',
  MessagePollVoteRemove = 'MESSAGE_POLL_VOTE_REMOVE',
  GuildScheduledEventCreate = 'GUILD_SCHEDULED_EVENT_CREATE',
  GuildScheduledEventUpdate = 'GUILD_SCHEDULED_EVENT_UPDATE',
  GuildScheduledEventDelete = 'GUILD_SCHEDULED_EVENT_DELETE',
  GuildScheduledEventUserAdd = 'GUILD_SCHEDULED_EVENT_USER_ADD',
  GuildScheduledEventUserRemove = 'GUILD_SCHEDULED_EVENT_USER_REMOVE',
  AutoModerationRuleCreate = 'AUTO_MODERATION_RULE_CREATE',
  AutoModerationRuleUpdate = 'AUTO_MODERATION_RULE_UPDATE',
  AutoModerationRuleDelete = 'AUTO_MODERATION_RULE_DELETE',
  AutoModerationActionExecution = 'AUTO_MODERATION_ACTION_EXECUTION',
  GuildAuditLogEntryCreate = 'GUILD_AUDIT_LOG_ENTRY_CREATE',
  EntitlementCreate = 'ENTITLEMENT_CREATE',
  EntitlementUpdate = 'ENTITLEMENT_UPDATE',
  EntitlementDelete = 'ENTITLEMENT_DELETE',
}

export interface GatewaySocketEvent {
  op: GatewayOpcodes;
  data: unknown;
  sequence?: number;
  event?: GatewayDispatchEvents;
}

export interface GatewayEvents {
  dispatch: (event: GatewaySocketEvent) => void;
}

/**
 * https://discord.com/developers/docs/topics/gateway#sending-heartbeats
 */
export interface GatewayHelloEventData {
  heartbeat_interval: number;
}

/**
 * https://discord.com/developers/docs/topics/gateway-events#ready
 */
export interface GatewayReadyDispatchData {
  /**
   * Api Version
   */
  v: number;

  /**
   * Yourself as raw data
   */
  user: IUserData;

  /**
   * Other users
   */
  users: IUserData[];

  /**
   * Guilds you are in
   */
  guilds: IGuildData[];

  /**
   * The session id
   */
  session_id: string;

  /**
   * The url you'll use when reconnecting
   */
  resume_gateway_url: string;

  /**
   * Your relationships with other users
   */
  relationships: Relationship[];
}
