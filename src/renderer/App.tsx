import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

// Styles
import './styles/global.css';
import './styles/vars.css';

// Components
import Titlebar from './components/Titlebar';
import Serverbar from './components/Serverbar';
import Loading from './components/Loading';

// Pages
import HomePage from './pages/Home';
import GuildPage from './pages/Guild';
import ChannelPage from './pages/Guild/Channel';
import DirectMessagePage from './pages/Home/DirectMessage';

export default function App() {
  return (
    <Router>
      <Titlebar />
      <Loading />
      <Serverbar />
      <div className="app__content">
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="dm/:dmId" element={<DirectMessagePage />} />
          </Route>
          <Route path="/guild/:id" element={<GuildPage />}>
            <Route path="channel/:channelId" element={<ChannelPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
