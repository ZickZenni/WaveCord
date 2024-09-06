import { useEffect, useState } from 'react';
import './UserPanel.css';
import RendererUser from '../../../discord/structures/user/RendererUser';
import { IUserData } from '../../../discord/structures/user/BaseUser';

export default function UserPanel() {
  const [user, setUser] = useState<RendererUser | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('discord:user')
      .then((data: IUserData) => {
        setUser(new RendererUser(data));
        return true;
      })
      .catch((err) => console.error(err));
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
          src={user.getAvatarUrl()}
          alt=""
        />
        <p className="userpanel__user_name">{user.globalName}</p>
      </div>
    </div>
  );
}
