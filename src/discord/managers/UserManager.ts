import { CacheHolder } from '../core/cache';
import { Client } from '../core/client';
import { Snowflake } from '../structures/Snowflake';
import MainUser from '../structures/user/MainUser';

export default class UserManager {
  public readonly client: Client;

  public readonly cache: CacheHolder<Snowflake, MainUser>;

  public clientUser: MainUser | null;

  constructor(client: Client) {
    this.client = client;
    this.cache = new CacheHolder();
    this.clientUser = null;
  }
}
