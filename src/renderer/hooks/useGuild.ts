import { useEffect, useState } from 'react';
import RendererGuild from '../../discord/structures/guild/RendererGuild';
import { IGuildData } from '../../discord/structures/guild/BaseGuild';

/**
 * Fetches a guild
 */
export default function useGuild(guildId: string) {
  const [guild, setGuild] = useState<RendererGuild | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('discord:fetch-guild', guildId)
      .then((data: IGuildData) => {
        setGuild(new RendererGuild(data));
        return true;
      })
      .catch((err) => console.error(err));
  }, [guildId]);

  return guild;
}
