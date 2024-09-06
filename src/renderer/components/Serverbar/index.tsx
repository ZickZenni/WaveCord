import { useEffect, useState } from 'react';
import './Serverbar.css';
import { Link, useLocation } from 'react-router-dom';
import RendererGuild from '../../../discord/structures/guild/RendererGuild';
import { IGuildData } from '../../../discord/structures/guild/BaseGuild';

export default function Serverbar() {
  // States
  const [guilds, setGuilds] = useState<RendererGuild[]>([]);

  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(async () => {
      const ready = await window.electron.ipcRenderer
        .invoke('discord:ready')
        .catch((err) => window.logger.error(err));

      if (!ready) return;

      const data: IGuildData[] = await window.electron.ipcRenderer
        .invoke('discord:guilds')
        .catch((err) => window.logger.error(err));

      window.logger.info(
        'Received guilds for server list:',
        data.map((v) => `${v.id}`).join(','),
      );
      setGuilds(data.map((v) => new RendererGuild(v)));
      clearInterval(interval);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="serverbar__container hidden_scrollbar">
      <div className="serverbar__list hidden_scrollbar">
        <Link className="serverbar__server" to="/" key="Serverbar:Home}">
          <div className="serverbar__server_icon">
            <p className="serverbar__server_char">WC</p>
          </div>
        </Link>
        {guilds.map((guild) => {
          const selected = location.pathname.startsWith(`/guild/${guild.id}`);

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
