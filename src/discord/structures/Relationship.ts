import { Snowflake } from './Snowflake';

export interface Relationship {
  user_id: Snowflake;
  type: number;
  since: string;
  nickname: string | null;
  is_spam_request: boolean;
  id: Snowflake;
}
