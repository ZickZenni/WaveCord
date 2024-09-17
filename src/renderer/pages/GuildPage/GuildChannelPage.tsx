import Message from '@/components/channel/Message';
import useChannel from '@/hooks/useChannel';
import useMessages from '@/hooks/useMessages';
import { useParams } from 'react-router-dom';

export default function GuildChannelPage() {
  const params = useParams();
  const channelId = params.channelId ?? '';

  const channel = useChannel(channelId);
  const messages = useMessages(channel);

  if (channel === null) return null;

  return (
    <div className="GuildChannelPage">
      <div className="GuildChannelPage--header">
        <p>{channel.name}</p>
      </div>
      <div className="GuildChannelPage--messages-container hidden-scrollbar">
        {messages.map((msg) => {
          return <Message message={msg} />;
        })}
      </div>
    </div>
  );
}
