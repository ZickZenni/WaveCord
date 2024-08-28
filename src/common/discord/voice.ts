import { Member } from './user';

export interface VoiceState {
  member: Member;
  user_id: string;
  suppress: boolean;
  session_id: string;
  self_video: boolean;
  self_mute: boolean;
  self_deaf: boolean;
  request_to_speak_timestamp: any;
  mute: boolean;
  guild_id: string;
  deaf: boolean;
  channel_id: string | null;
}
