import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import UserPanel from '../../components/UserPanel';
import './Home.css';
import { Relationship } from '../../../discord/structures/Relationship';
import RendererUser from '../../../discord/structures/user/RendererUser';
import { IUserData } from '../../../discord/structures/user/BaseUser';

export default function HomePage() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [users, setUsers] = useState<RendererUser[]>([]);

  useEffect(() => {
    const fetchRelationships = async () => {
      const ready = await window.electron.ipcRenderer
        .invoke('discord:ready')
        .catch((err) => window.logger.error(err));

      if (!ready) return false;

      const data: any = await window.electron.ipcRenderer
        .invoke('discord:relationships')
        .catch((err) => window.logger.error(err));

      const ships: Relationship[] = data.relationships;
      const usrs: IUserData[] = data.users;

      window.logger.info('Received relationships:', data);
      setRelationships(ships);
      setUsers(usrs.map((v) => new RendererUser(v)));
      return true;
    };

    const interval = setInterval(async () => {
      if (await fetchRelationships()) clearInterval(interval);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="home_page">
      <Topbar />
      <div className="home_page__container">
        <div className="home_page__sidebar">
          <div className="home_page__sidebar_list hidden_scrollbar">
            {relationships.map((relationship) => {
              const user = users.find((v) => v.id === relationship.user_id);
              if (user === undefined) return null;

              return (
                <Link
                  to={`/dm/${relationship.id}`}
                  key={`Relationship:${relationship.id}`}
                  className="home_page__relationship"
                >
                  <img
                    className="home_page__avatar"
                    src={user.getAvatarUrl()}
                    alt={`UserAvatarRelationship:${user.id}`}
                  />
                  <p>{relationship.nickname ?? user.globalName}</p>
                </Link>
              );
            })}
          </div>
          <UserPanel />
        </div>
        <div className="home_page__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
