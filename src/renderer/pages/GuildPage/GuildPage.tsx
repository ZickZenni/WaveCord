import ChannelButton from '@/components/channel/Channel';
import PageLayout from '@/components/page/PageLayout';
import PageSideBar from '@/components/page/PageSideBar';
import useChannels from '@/hooks/useChannels';
import useGuild from '@/hooks/useGuild';
import { useParams } from 'react-router-dom';

export default function GuildPage() {
  const params = useParams();

  const guildId = params.guildId ?? '';

  const channels = useChannels(guildId);
  const guild = useGuild(guildId);

  return (
    <PageLayout>
      <div className="GuildPage">
        <PageSideBar>
          {channels.map((channel) => {
            return (
              <ChannelButton key={`Channel:${channel.id}`} channel={channel} />
            );
          })}
        </PageSideBar>
      </div>
    </PageLayout>
  );
}
