import { IUserData } from '@/discord/structures/user/BaseUser';
import RendererUser from '@/discord/structures/user/RendererUser';
import { useEffect, useState } from 'react';

/**
 * Fetches a user
 */
export default function useUser(userId: string | undefined) {
  const [user, setUser] = useState<RendererUser | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      window.electron.ipcRenderer
        .invoke('discord:user', userId)
        .then((data: IUserData | null) => {
          if (data) setUser(new RendererUser(data));
          return true;
        })
        .catch((err) => console.error(err));
    };

    fetchUser();

    const interval = setInterval(() => fetchUser, 1000);
    return () => clearInterval(interval);
  }, [userId]);

  return user;
}
