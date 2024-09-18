import ChannelList from '@/components/channel/ChannelList';
import PageLayout from '@/components/page/PageLayout';
import PageSideBar from '@/components/page/PageSideBar';
import ServerInfo from '@/components/server/ServerInfo';
import useChannels from '@/hooks/useChannels';
import useGuild from '@/hooks/useGuild';
import { Outlet, useParams } from 'react-router-dom';

export default function GuildPage() {
  const params = useParams();

  const guildId = params.guildId ?? '';

  const channels = useChannels(guildId);
  const guild = useGuild(guildId);

  if (guild === null) return null;

  return (
    <PageLayout>
      <div className="GuildPage">
        <PageSideBar>
          <ServerInfo guild={guild} />
          <ChannelList guildId={guildId} channels={channels} />
        </PageSideBar>
        <div className="GuildPage--content">
          <Outlet />
        </div>
      </div>
    </PageLayout>
  );
}
