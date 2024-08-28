import { VoiceState } from '../voice';
import { User } from '../user';

export default class VoiceService {
  private readonly voiceStates: Map<string, VoiceState>;

  public constructor() {
    this.voiceStates = new Map();
  }

  public setVoiceState(user: User | string, state: VoiceState | null) {
    const userId = typeof user === 'string' ? user : user.id;
    if (state === null) {
      this.voiceStates.delete(userId);
      return;
    }
    this.voiceStates.set(userId, state);
  }

  public getVoiceStates(): Map<string, VoiceState> {
    return this.voiceStates;
  }

  public getGuildVoiceStates(guildId: string): VoiceState[] {
    const states: VoiceState[] = [];

    const array = Array.from(this.voiceStates.entries());
    for (let i = 0; i < array.length; i += 1) {
      const element = array[i];
      const voiceState = element['1'];
      if (voiceState.guild_id === guildId) states.push(voiceState);
    }

    return states;
  }

  public getChannelVoiceStates(channelId: string): VoiceState[] {
    const states: VoiceState[] = [];

    const array = Array.from(this.voiceStates.entries());
    for (let i = 0; i < array.length; i += 1) {
      const element = array[i];
      const voiceState = element['1'];
      if (voiceState.channel_id === channelId) states.push(voiceState);
    }

    return states;
  }
}
