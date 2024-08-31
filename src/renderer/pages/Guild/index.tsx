import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';

// Channel Icons
import TextChannelIcon from '../../../../assets/app/icons/channel/text-icon.svg';
import VoiceChannelIcon from '../../../../assets/app/icons/channel/volume-2.svg';
import AnnouncementChannelIcon from '../../../../assets/app/icons/channel/tv.svg';
import StageChannelIcon from '../../../../assets/app/icons/channel/radio.svg';
import CategoryIcon from '../../../../assets/app/icons/channel/arrow-down.svg';

import './Guild.css';
import { Guild } from '../../../common/discord/guild';
import Channel, { ChannelType } from '../../../common/discord/channel';
import Topbar from '../../components/Topbar';
import { sortChannels } from '../../utils/channelUtils';

function ChannelWrapper({
  children,
  isCurrent,
  channel,
}: {
  children: ReactNode[];
  isCurrent: boolean;
  channel: Channel;
}) {
  const classes = `guild_page__channel ${isCurrent ? 'guild_page__current_channel' : ''}`;

  if (
    channel.type !== ChannelType.GuildVoice &&
    channel.type !== ChannelType.GuildCategory
  ) {
    return (
      <Link
        to={`/guild/${channel.guildId}/channel/${channel.id}`}
        key={`GuildPageChannel:${channel.id}`}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <div key={`GuildPageChannel:${channel.id}`} className={classes}>
      {children}
    </div>
  );
}

export default function GuildPage() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const sorted = sortChannels(guild ? guild.channels : []);

  return (
    <div className="guild_page">
      <Topbar />
      <div className="guild_page__container">
        <div className="guild_page__guild_info">
          <p className="guild_page__guild_name">{guild?.name}</p>
          {guild?.banner !== null && (
            <div className="guild_page__banner">
              <img
                className="guild_page__banner_img"
                src={`https://cdn.discordapp.com/banners/${guild?.id}/${guild?.banner}.webp?size=300`}
                alt="Guild Banner"
              />
            </div>
          )}
        </div>
        <div className="guild_page__channel_list app__item_list hidden_scrollbar">
          {sorted.map((channel) => {
            const isCategory = channel.type === ChannelType.GuildCategory;
            const isCurrent =
              location.pathname === `/guild/${guild?.id}/channel/${channel.id}`;

            const getIcon = () => {
              switch (channel.type) {
                case ChannelType.GuildVoice:
                  return VoiceChannelIcon;
                case ChannelType.GuildAnnouncement:
                  return AnnouncementChannelIcon;
                case ChannelType.GuildStageVoice:
                  return StageChannelIcon;
                case ChannelType.GuildCategory:
                  return CategoryIcon;
                default:
                  return TextChannelIcon;
              }
            };
            return (
              <ChannelWrapper isCurrent={isCurrent} channel={channel}>
                {!isCategory && (
                  <img
                    className="guild_page__channel_icon"
                    src={getIcon()}
                    alt="Text Channel Icon"
                  />
                )}
                <p
                  className={`guild_page__channel_name ${isCategory ? 'guild_page__category' : ''}`}
                >
                  {channel.name}
                </p>
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
    </div>
  );
}
