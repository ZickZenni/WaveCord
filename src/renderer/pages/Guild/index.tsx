import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';

// Channel Icons
import TextChannelIcon from '../../../../assets/app/icons/channel/text-icon.svg';
import VoiceChannelIcon from '../../../../assets/app/icons/channel/volume-2.svg';
import AnnouncementChannelIcon from '../../../../assets/app/icons/channel/tv.svg';
import StageChannelIcon from '../../../../assets/app/icons/channel/radio.svg';

import './Guild.css';
import { Guild } from '../../../common/discord/guild';
import Channel, { ChannelType } from '../../../common/discord/channel';

function ChannelWrapper({
  children,
  channel,
}: {
  children: ReactNode[];
  channel: Channel;
}) {
  if (channel.type !== ChannelType.GuildVoice) {
    return (
      <Link
        to={`/guild/${channel.guildId}/channel/${channel.id}`}
        key={`GuildPageChannel:${channel.id}`}
        className="guild_page__channel"
      >
        {children}
      </Link>
    );
  }

  return (
    <div key={`GuildPageChannel:${channel.id}`} className="guild_page__channel">
      {children}
    </div>
  );
}

export default function GuildPage() {
  const navigate = useNavigate();
  const params = useParams();
  const guildId = params.id ?? '';

  // States
  const [guild, setGuild] = useState<Guild | null | undefined>(undefined);

  useEffect(() => {
    if (guild === undefined || (guild && guild.id !== guildId)) {
      // Load guild if guild id is not invalid
      if (guildId.length !== 0) {
        window.electron.ipcRenderer
          .invoke('DISCORD_LOAD_GUILD', guildId)
          .then((data) => {
            setGuild(data);
            return true;
          })
          .catch((err) => window.logger.error(err));

        window.electron.ipcRenderer
          .invoke('DISCORD_GET_LAST_VISITED_GUILD_CHANNEL', guildId)
          .then((channel: Channel | null) => {
            if (channel !== null) {
              navigate(`/guild/${guildId}/channel/${channel.id}`);
            }
            return true;
          })
          .catch((err) => window.logger.error(err));
      }
    }

    return () => {
      if (guild && guildId !== guild.id) setGuild(undefined);
    };
  }, [guild, guildId, navigate]);

  if (guildId.length === 0) return null;

  // Either the guild does not exist or we are not on this guild
  if (guild === null)
    return <p>Server does not exist or you are not in this server!</p>;

  return (
    <div className="guild_page__container">
      <div className="guild_page__channel_list app__item_list hidden_scrollbar">
        {guild?.channels.map((channel) => {
          const getIcon = () => {
            switch (channel.type) {
              case ChannelType.GuildVoice:
                return VoiceChannelIcon;
              case ChannelType.GuildAnnouncement:
                return AnnouncementChannelIcon;
              case ChannelType.GuildStageVoice:
                return StageChannelIcon;
              default:
                return TextChannelIcon;
            }
          };
          return (
            <ChannelWrapper channel={channel}>
              <img
                className="guild_page__channel_icon"
                src={getIcon()}
                alt="Text Channel Icon"
              />
              <p>{channel.name}</p>
            </ChannelWrapper>
          );
        })}
      </div>
      <div className="guild_page__content">
        <Outlet />
      </div>
      <div className="guild_page__member_list">
        {guild?.members.map((member) => {
          return (
            <div key={`GuildPage:Member:${member.user_id}`}>
              {member.user_id}
            </div>
          );
        })}
      </div>
    </div>
  );
}
