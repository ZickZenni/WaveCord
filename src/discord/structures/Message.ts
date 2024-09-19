import { Attachment } from './Attachment';
import { Reaction } from './Reaction';
import { Snowflake } from './Snowflake';
import { IUserData } from './user/BaseUser';

export interface Message {
  attachments: Attachment[];
  content: string;
  timestamp: string;
  id: Snowflake;
  author: IUserData;
  channel_id: Snowflake;
  reactions?: Reaction[];
}
