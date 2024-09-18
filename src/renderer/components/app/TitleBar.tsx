import MinimizeIcon from '@/assets/app/icons/titlebar/minimize.svg';
import MaximizeIcon from '@/assets/app/icons/titlebar/maximize.svg';
import CloseIcon from '@/assets/app/icons/titlebar/x.svg';

export default function TitleBar() {
  const handleMinimize = () => {
    window.electron.ipcRenderer.sendMessage('window:minimize');
  };

  const handleMaximize = () => {
    window.electron.ipcRenderer.sendMessage('window:maximize');
  };

  const handleClose = () => {
    window.electron.ipcRenderer.sendMessage('app:exit');
  };

  return (
    <div className="TitleBar">
      <div
        className="TitleBar--button"
        onClick={handleClose}
        role="presentation"
      >
        <img
          className="TitleBar--button--icon"
          src={CloseIcon}
          alt="Close Button"
        />
      </div>
      <div
        className="TitleBar--button"
        onClick={handleMaximize}
        role="presentation"
      >
        <img
          className="TitleBar--button--icon"
          src={MaximizeIcon}
          alt="Maximize Button"
        />
      </div>
      <div
        className="TitleBar--button"
        onClick={handleMinimize}
        role="presentation"
      >
        <img
          className="TitleBar--button--icon"
          src={MinimizeIcon}
          alt="Minimize Button"
        />
      </div>
      <p className="TitleBar--title">WaveCord</p>
    </div>
  );
}
