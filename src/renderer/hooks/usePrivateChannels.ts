import { IChannelData } from '@/discord/structures/channel/BaseChannel';
import RendererChannel from '@/discord/structures/channel/RendererChannel';
import { useEffect, useState } from 'react';

/**
 * Fetches all private channels from the user
 */
export default function usePrivateChannels() {
  const [channels, setChannels] = useState<RendererChannel[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('discord:private-channels')
      .then((data: IChannelData[]) => {
        setChannels(data.map((v) => new RendererChannel(v)));
        return true;
      })
      .catch((err) => console.error(err));
  }, []);

  return channels;
}
