import { useEffect, useState } from 'react';
import RendererGuild from '../../discord/structures/guild/RendererGuild';
import { IGuildData } from '../../discord/structures/guild/BaseGuild';

/**
 * Fetches all guilds the user is in
 */
export default function useGuilds() {
  const [guilds, setGuilds] = useState<RendererGuild[]>([]);

  useEffect(() => {
    const fetchGuilds = () => {
      window.electron.ipcRenderer
        .invoke('discord:guilds')
        .then((data: IGuildData[]) => {
          setGuilds(data.map((v) => new RendererGuild(v)));
          return true;
        })
        .catch((err) => console.error(err));
    };

    const interval = setInterval(fetchGuilds, 2000);

    fetchGuilds();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return guilds;
}
