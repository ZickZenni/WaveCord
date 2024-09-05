import { Snowflake } from './Snowflake';

export interface Relationship {
  user_id: Snowflake;
  type: number;
  since: string;
  nickname: any;
  is_spam_request: boolean;
  id: Snowflake;
}
