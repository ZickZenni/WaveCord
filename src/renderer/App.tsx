/* eslint-disable import/order */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

// Styles
import '@/styles/app/App.css';
import '@/styles/app/TitleBar.css';
import '@/styles/server/ServerBar.css';

// Components
import AppContent from '@/components/app/AppContent';
import TitleBar from './components/app/TitleBar';
import ServerBar from '@/components/server/ServerBar';

// Pages
import HomePage from '@/pages/HomePage/HomePage';

export default function App() {
  return (
    <Router>
      <TitleBar />
      <AppContent>
        <ServerBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AppContent>
    </Router>
  );
}
