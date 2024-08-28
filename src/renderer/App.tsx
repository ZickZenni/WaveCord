import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';
import './styles/global.css';
import './styles/vars.css';
import Titlebar from './components/Titlebar';
import HomePage from './pages/Home';
import Serverbar from './components/Serverbar';
import GuildPage from './pages/Guild';

export default function App() {
  return (
    <Router>
      <Titlebar />
      <Loading />
      <Serverbar />
      <div className="app__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guild/:id" element={<GuildPage />} />
        </Routes>
      </div>
    </Router>
  );
}
