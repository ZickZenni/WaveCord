import { IChannelData } from '@/discord/structures/channel/BaseChannel';
import RendererChannel from '@/discord/structures/channel/RendererChannel';
import { useEffect, useState } from 'react';

export default function useChannel(channelId: string): RendererChannel | null {
  const [channel, setChannel] = useState<RendererChannel | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('discord:load-channel', channelId)
      .then((data: IChannelData | null) => {
        if (data) setChannel(new RendererChannel(data));
        return true;
      })
      .catch((err) => console.error(err));
  }, [channelId]);

  return channel;
}
