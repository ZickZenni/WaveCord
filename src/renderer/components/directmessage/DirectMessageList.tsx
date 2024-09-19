import usePrivateChannels from '@/hooks/usePrivateChannels';
import DirectMessageButton from './DirectMessageButton';

export default function DirectMessageList() {
  const channels = usePrivateChannels();

  return (
    <div className="DirectMessageList hidden-scrollbar">
      {
        /* Sort private channels by their last message id */
        channels
          .sort((a, b) => {
            if (a.lastMessageId === null) return -1;

            if (b.lastMessageId === null) return 1;

            return Number(a.lastMessageId) - Number(b.lastMessageId);
          })
          .reverse()
          .map((channel) => {
            return (
              <DirectMessageButton
                key={`Channel:home:${channel.id}`}
                channel={channel}
              />
            );
          })
      }
    </div>
  );
}
