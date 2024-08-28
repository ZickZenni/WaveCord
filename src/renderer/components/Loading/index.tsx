import { useEffect } from 'react';
import './Loading.css';
import { useNavigate } from 'react-router-dom';
import Messages from './Messages';

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      window.electron.ipcRenderer
        .invoke('DISCORD_READY')
        .then((value: boolean) => {
          const container = document.getElementById('loading__container');
          if (container === null) return false;

          if (value) {
            container.style.opacity = '0.0';
            container.style.pointerEvents = 'none';
          } else {
            container.style.opacity = '1.0';
            container.style.pointerEvents = 'auto';
          }
          return true;
        })
        .catch((err) => console.error(err));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="loading__container" id="loading__container">
      <h1 className="loading__title">WaveCord</h1>
      <h2>{Messages[Math.floor(Math.random() * Messages.length)]}</h2>
    </div>
  );
}
