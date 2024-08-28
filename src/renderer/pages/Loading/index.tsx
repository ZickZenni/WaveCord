import { useEffect } from 'react';
import './Loading.css';
import { useNavigate } from 'react-router-dom';

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      window.electron.ipcRenderer
        .invoke('DISCORD_READY')
        .then((value: boolean) => {
          if (value) navigate('/home');
          return true;
        })
        .catch((err) => console.error(err));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="loading__container">
      <h1 className="loading__title">WaveCord</h1>
      <span className="loading__loader" />
    </div>
  );
}
