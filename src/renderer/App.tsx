/* eslint-disable import/order */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

// Styles
import '@/styles/app/App.css';
import '@/styles/app/TitleBar.css';
import '@/styles/app/SideBar.css';
import '@/styles/app/UserBar.css';

import '@/styles/channel/ChannelButton.css';
import '@/styles/channel/ChannelList.css';
import '@/styles/channel/Message.css';

import '@/styles/page/GuildChannelPage.css';
import '@/styles/page/GuildPage.css';
import '@/styles/page/PageLayout.css';
import '@/styles/page/PageSideBar.css';

import '@/styles/server/ServerBar.css';
import '@/styles/server/Server.css';
import '@/styles/server/ServerInfo.css';

import '@/styles/user/UserPanel.css';

// Components
import AppContent from '@/components/app/AppContent';
import TitleBar from '@/components/app/TitleBar';
import UserPanel from '@/components/user/UserPanel';
import SideBar from '@/components/app/SideBar';

// Pages
import HomePage from '@/pages/HomePage/HomePage';
import GuildPage from '@/pages/GuildPage/GuildPage';
import GuildChannelPage from './pages/GuildPage/GuildChannelPage';

export default function App() {
  return (
    <Router>
      <TitleBar />
      <AppContent>
        <SideBar />
        <UserPanel />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guild/:guildId" element={<GuildPage />}>
            <Route path="channel/:channelId" element={<GuildChannelPage />} />
          </Route>
        </Routes>
      </AppContent>
    </Router>
  );
}
