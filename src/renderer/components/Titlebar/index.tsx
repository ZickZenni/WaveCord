import MinimizeIcon from '../../../../assets/app/icons/titlebar/minimize.svg';
import MaximizeIcon from '../../../../assets/app/icons/titlebar/maximize.svg';
import CloseIcon from '../../../../assets/app/icons/titlebar/x.svg';
import './Titlebar.css';

export default function Titlebar() {
  const handleMinimize = () => {
    window.electron.ipcRenderer.sendMessage('WINDOW_MINIMIZE');
  };

  const handleMaximize = () => {
    window.electron.ipcRenderer.sendMessage('WINDOW_MAXIMIZE');
  };

  const handleClose = () => {
    window.electron.ipcRenderer.sendMessage('APP_EXIT');
  };

  return (
    <div className="titlebar__bar">
      <img
        className="titlebar__button"
        src={CloseIcon}
        alt="Close Button"
        onClick={handleClose}
        role="presentation"
      />
      <img
        className="titlebar__button"
        src={MaximizeIcon}
        alt="Maximize Button"
        onClick={handleMaximize}
        role="presentation"
      />
      <img
        className="titlebar__button"
        src={MinimizeIcon}
        alt="Minimize Button"
        onClick={handleMinimize}
        role="presentation"
      />
    </div>
  );
}
