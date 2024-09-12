import { useEffect, useState } from 'react';
import RendererGuild from '../../discord/structures/guild/RendererGuild';
import { IGuildData } from '../../discord/structures/guild/BaseGuild';

export default function useGuilds() {
  const [guilds, setGuilds] = useState<RendererGuild[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('discord:guilds')
      .then((data: IGuildData[]) => {
        setGuilds(data.map((v) => new RendererGuild(v)));
        return true;
      })
      .catch((err) => console.error(err));
  }, []);

  return guilds;
}
