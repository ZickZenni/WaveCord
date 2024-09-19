import { createRoot } from 'react-dom/client';
import App from './App';
import { AppConfig } from '../common/appconfig';

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let config: AppConfig | null = null;

window.electron.ipcRenderer
  .invoke('app:config')
  .then((conf: AppConfig) => {
    config = conf;

    const container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);
    root.render(<App />);
    return true;
  })
  .catch((err) => console.error(err));
