import { ChannelType } from '@/discord/structures/channel/BaseChannel';
import RendererChannel from '@/discord/structures/channel/RendererChannel';
import { getChannelIcon } from '@/utils/channelUtils';

type ChannelButtonProps = {
  channel: RendererChannel;
  onClick: (channel: RendererChannel) => void;
};

export default function ChannelButton({
  channel,
  onClick,
}: ChannelButtonProps) {
  return (
    <div
      className={
        channel.type !== ChannelType.GuildCategory
          ? `ChannelButton--normal`
          : 'ChannelButton--category'
      }
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
