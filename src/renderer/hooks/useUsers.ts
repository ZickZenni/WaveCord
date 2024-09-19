import { Snowflake } from '@/discord/structures/Snowflake';
import { IUserData } from '@/discord/structures/user/BaseUser';
import RendererUser from '@/discord/structures/user/RendererUser';
import { useEffect, useState } from 'react';

/**
 * Fetches multiple users
 */
export default function useUsers(userIds: Snowflake[]) {
  const [users, setUsers] = useState<RendererUser[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('discord:users', userIds)
      .then((data: IUserData[]) => {
        setUsers(data.map((v) => new RendererUser(v)));
        return true;
      })
      .catch((err) => console.error(err));
  });

  return users;
}
