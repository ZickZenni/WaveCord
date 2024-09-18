import { ChannelType } from '@/discord/structures/channel/BaseChannel';
import RendererChannel from '@/discord/structures/channel/RendererChannel';
import { getChannelIcon } from '@/utils/channelUtils';
import { useLocation } from 'react-router-dom';

type ChannelButtonProps = {
  channel: RendererChannel;
  onClick: (channel: RendererChannel) => void;
};

export default function ChannelButton({
  channel,
  onClick,
}: ChannelButtonProps) {
  const location = useLocation();

  const isCategory = channel.type === ChannelType.GuildCategory;
  const isSelected =
    !isCategory && location.pathname.includes(`/channel/${channel.id}`);

  let classes = !isCategory
    ? `ChannelButton--normal`
    : 'ChannelButton--category';

  if (isSelected) {
    classes += ' ChannelButton--selected';
  }

  return (
    <div
      className={classes}
      onClick={() => onClick(channel)}
      role="presentation"
    >
      <img
        className="ChannelButton--icon"
        src={getChannelIcon(channel)}
        alt="Channel Icon"
      />
      <p className="ChannelButton--name">{channel.name}</p>
    </div>
  );
}
