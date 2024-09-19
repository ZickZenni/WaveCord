import DirectMessageList from '@/components/directmessage/DirectMessageList';
import PageLayout from '@/components/page/PageLayout';
import PageSideBar from '@/components/page/PageSideBar';
import { Outlet } from 'react-router-dom';

export default function HomePage() {
  return (
    <PageLayout>
      <div className="HomePage">
        <PageSideBar>
          <DirectMessageList />
        </PageSideBar>
        <div className="HomePage--content">
          <Outlet />
        </div>
      </div>
    </PageLayout>
  );
}
