import { Snowflake } from './Snowflake';
import { IUserData } from './user/BaseUser';

export interface Message {
  content: string;
  timestamp: string;
  id: Snowflake;
  author: IUserData;
}
