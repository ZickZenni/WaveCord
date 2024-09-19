import { Snowflake } from './Snowflake';

export interface Emoji {
  animated: boolean;
  available: boolean;
  id: Snowflake;
  managed: boolean;
  name: string;
  require_colons: boolean;
  roles: any[];
  version: number;
}
