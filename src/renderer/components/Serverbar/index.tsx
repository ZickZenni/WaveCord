import { useEffect, useState } from 'react';
import './Serverbar.css';
import { Link, useLocation } from 'react-router-dom';
import { Guild } from '../../../common/discord/guild';

export default function Serverbar() {
  // States
  const [guilds, setGuilds] = useState<Guild[]>([]);

  const location = useLocation();

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('DISCORD_GET_GUILDS')
      .then((data: Guild[]) => {
        console.log(data);
        setGuilds(data);
        return true;
      })
      .catch((err) => console.error(err));
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
