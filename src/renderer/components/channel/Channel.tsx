import RendererChannel from '@/discord/structures/channel/RendererChannel';

type ChannelButtonProps = {
  channel: RendererChannel;
};

export default function ChannelButton({ channel }: ChannelButtonProps) {
  return (
    <div className="ChannelButton">
      <p className="ChannelButton--name">{channel.name}</p>
    </div>
  );
}
