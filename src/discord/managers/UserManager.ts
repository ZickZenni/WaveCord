import { Client } from '../core/client';
import { Snowflake } from '../structures/Snowflake';
import MainUser from '../structures/user/MainUser';
import Collection from '../util/collection';

export default class UserManager {
  public readonly client: Client;

  public readonly cache: Collection<Snowflake, MainUser>;

  public clientUser: MainUser | null;

  constructor(client: Client) {
    this.client = client;
    this.cache = new Collection();
    this.clientUser = null;
  }
}
