import { useEffect, useState } from 'react';
import './UserPanel.css';
import { User } from '../../../common/discord/user';

export default function UserPanel() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('DISCORD_GET_USER', '@me')
      .then((data) => {
        setUser(data);
        return true;
      })
      .catch((err) => window.logger.error(err));
  }, []);

  if (user === null)
    return (
      <div className="userpanel__container">
        <div className="userpanel__user_info" />
      </div>
    );

  return (
    <div className="userpanel__container">
      <div className="userpanel__user_info">
        <img
          className="userpanel__user_avatar"
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
          alt=""
        />
        <p className="userpanel__user_name">{user.globalName}</p>
      </div>
    </div>
  );
}
