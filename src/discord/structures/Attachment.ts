import { Snowflake } from './Snowflake';

export interface Attachment {
  content_type: string;
  filename: string;
  height: number;
  id: Snowflake;
  placeholder: string;
  proxy_url: string;
  size: number;
  url: string;
  width: number;
}
