import Message from '@/components/channel/Message';
import { ChannelType } from '@/discord/structures/channel/BaseChannel';
import useChannel from '@/hooks/useChannel';
import useMessages from '@/hooks/useMessages';
import useUsers from '@/hooks/useUsers';
import { useParams } from 'react-router-dom';

export default function HomeChannelPage() {
  const params = useParams();
  const channelId = params.channelId ?? '';

  const channel = useChannel(channelId);
  const messages = useMessages(channel);
  const members = useUsers(channel?.recipientIds ?? []);

  if (channel === null) return null;

  const getName = () => {
    if (channel.type === ChannelType.GroupDM) return channel.name;

    if (members.length === 0) return '';

    return members[0].globalName;
  };

  return (
    <div className="GuildChannelPage">
      <div className="GuildChannelPage--header">
        <p className="GuildChannelPage--header-title">{getName()}</p>
      </div>
      <div className="GuildChannelPage--messages-container hidden-scrollbar">
        {messages.map((msg) => {
          return <Message message={msg} />;
        })}
      </div>
    </div>
  );
}
