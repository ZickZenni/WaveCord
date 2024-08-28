import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingPage from './pages/Loading';
import './styles/global.css';
import './styles/vars.css';
import Topbar from './components/Topbar';

export default function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<LoadingPage />} />
      </Routes>
    </Router>
  );
}
