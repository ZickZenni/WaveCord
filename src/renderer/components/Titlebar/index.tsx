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
      <div
        className="titlebar__button"
        onClick={handleClose}
        role="presentation"
      >
        <img
          className="titlebar__button_icon"
          src={CloseIcon}
          alt="Close Button"
        />
      </div>
      <div
        className="titlebar__button"
        onClick={handleMaximize}
        role="presentation"
      >
        <img
          className="titlebar__button_icon"
          src={MaximizeIcon}
          alt="Maximize Button"
        />
      </div>
      <div
        className="titlebar__button"
        onClick={handleMinimize}
        role="presentation"
      >
        <img
          className="titlebar__button_icon"
          src={MinimizeIcon}
          alt="Minimize Button"
        />
      </div>
    </div>
  );
}
