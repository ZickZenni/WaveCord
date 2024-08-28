import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingPage from './pages/Loading';
import './styles/global.css';
import './styles/vars.css';
import Titlebar from './components/Titlebar';
import HomePage from './pages/Home';

export default function App() {
  return (
    <Router>
      <Titlebar />
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
