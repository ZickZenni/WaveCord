import { ChannelType } from '@/discord/structures/channel/BaseChannel';
import RendererChannel from '@/discord/structures/channel/RendererChannel';
import useUser from '@/hooks/useUser';
import useUsers from '@/hooks/useUsers';
import { useLocation, useNavigate } from 'react-router-dom';

type DirectMessageButtonProps = {
  channel: RendererChannel;
};

export default function DirectMessageButton({
  channel,
}: DirectMessageButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useUser(undefined);
  const members = useUsers(channel.recipientIds ?? []);

  if (user === null) return null;

  const onClick = () => {
    navigate(`/channel/${channel.id}`);
  };

  const getName = () => {
    if (channel.type === ChannelType.GroupDM) {
      if (channel.name.length > 0) return channel.name;

      const membs = [user, ...members];
      return membs
        .map((v) => (v.globalName ? v.globalName : v.username))
        .join(', ');
    }

    if (members.length === 0) return '';

    const member = members[0];

    if (member.globalName === null || member.globalName.length === 0)
      return member.username;

    return member.globalName;
  };

  const getIcon = () => {
    if (members.length === 0) return '';

    if (channel.type === ChannelType.GroupDM)
      return channel.getChannelIcon() ?? members[0].getAvatarUrl();

    return members[0].getAvatarUrl();
  };

  const isSelected = location.pathname.includes(`/channel/${channel.id}`);

  return (
    <div
      className={`DirectMessage ${isSelected && 'DirectMessage--selected'}`}
      role="presentation"
      onClick={() => onClick()}
    >
      <img
        className="DirectMessage--icon-img"
        src={getIcon()}
        alt="Direct Message Icon"
      />
      <p className="DirectMessage--name">{getName()}</p>
    </div>
  );
}
