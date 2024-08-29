import { useEffect, useState } from 'react';
import './Serverbar.css';
import { Link, useLocation } from 'react-router-dom';
import { Guild } from '../../../common/discord/guild';

export default function Serverbar() {
  // States
  const [guilds, setGuilds] = useState<Guild[]>([]);

  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(async () => {
      const ready = await window.electron.ipcRenderer
        .invoke('DISCORD_READY')
        .catch((err) => window.logger.error(err));

      if (!ready) return;

      const data: Guild[] = await window.electron.ipcRenderer
        .invoke('DISCORD_GET_GUILDS')
        .catch((err) => window.logger.error(err));

      window.logger.log(
        'Received guilds for server list:',
        data.map((v) => `${v.id}`).join(','),
      );
      setGuilds(data);
      clearInterval(interval);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="serverbar__container hidden_scrollbar">
      <div className="serverbar__list hidden_scrollbar">
        {guilds.map((guild) => {
          const selected = location.pathname.endsWith(`/guild/${guild.id}`);

          return (
            <Link
              className="serverbar__server"
              to={`/guild/${guild.id}`}
              key={`Serverbar:${guild.id}`}
            >
              <div
                className="serverbar__server_selector"
                style={{
                  opacity: selected ? '1.0' : '0.0',
                }}
              />
              {guild.icon ? (
                <img
                  className="serverbar__server_icon"
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  alt={`Guild Icon ${guild.id}`}
                />
              ) : (
                <div className="serverbar__server_icon">
                  <p className="serverbar__server_char">
                    {guild.name.slice(0, 1)}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
