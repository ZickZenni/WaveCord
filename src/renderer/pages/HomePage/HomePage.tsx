import DirectMessageButton from '@/components/directmessage/DirectMessageButton';
import PageLayout from '@/components/page/PageLayout';
import PageSideBar from '@/components/page/PageSideBar';
import usePrivateChannels from '@/hooks/usePrivateChannels';
import { Outlet } from 'react-router-dom';

export default function HomePage() {
  const channels = usePrivateChannels();

  return (
    <PageLayout>
      <div className="HomePage">
        <PageSideBar>
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
        </PageSideBar>
        <div className="HomePage--content">
          <Outlet />
        </div>
      </div>
    </PageLayout>
  );
}
