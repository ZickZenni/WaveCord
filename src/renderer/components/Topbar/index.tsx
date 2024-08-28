import MinimizeIcon from '../../../../assets/app/icons/topbar/minimize.svg';
import MaximizeIcon from '../../../../assets/app/icons/topbar/maximize.svg';
import CloseIcon from '../../../../assets/app/icons/topbar/x.svg';
import './Topbar.css';

export default function Topbar() {
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
    <div className="topbar__bar">
      <img
        className="topbar__button"
        src={CloseIcon}
        alt="Close Button"
        onClick={handleClose}
        role="presentation"
      />
      <img
        className="topbar__button"
        src={MaximizeIcon}
        alt="Maximize Button"
        onClick={handleMaximize}
        role="presentation"
      />
      <img
        className="topbar__button"
        src={MinimizeIcon}
        alt="Minimize Button"
        onClick={handleMinimize}
        role="presentation"
      />
    </div>
  );
}
