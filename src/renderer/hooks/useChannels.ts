import { IChannelData } from '@/discord/structures/channel/BaseChannel';
import RendererChannel from '@/discord/structures/channel/RendererChannel';
import { useEffect, useState } from 'react';

/**
 * Fetches all channels from a guild
 */
export default function useChannels(guildId: string) {
  const [channels, setChannels] = useState<RendererChannel[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('discord:channels', guildId)
      .then((data: IChannelData[]) => {
        setChannels(data.map((v) => new RendererChannel(v)));
        return true;
      })
      .catch((err) => console.error(err));
  }, [guildId]);

  return channels;
}
