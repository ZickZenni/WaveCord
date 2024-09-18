import RendererChannel from '@/discord/structures/channel/RendererChannel';
import { sortChannels } from '@/utils/channelUtils';
import { ChannelType } from '@/discord/structures/channel/BaseChannel';
import { useNavigate } from 'react-router-dom';
import ChannelButton from './ChannelButton';

type ChannelListProps = {
  guildId: string;
  channels: RendererChannel[];
};

const supportedTypes = [ChannelType.GuildText, ChannelType.GuildAnnouncement];

export default function ChannelList({ guildId, channels }: ChannelListProps) {
  const navigate = useNavigate();
  const sorted = sortChannels(channels);

  const onChannelClick = (channel: RendererChannel) => {
    // Text Channels are currently only supported
    if (!supportedTypes.includes(channel.type)) return;

    navigate(`/guild/${guildId}/channel/${channel.id}`);
  };

  return (
    <div className="ChannelList hidden-scrollbar">
      {sorted.map((channel) => {
        return (
          <ChannelButton
            key={`Channel:${channel.id}`}
            channel={channel}
            onClick={onChannelClick}
          />
        );
      })}
    </div>
  );
}
