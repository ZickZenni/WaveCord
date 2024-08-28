/* eslint-disable global-require */
import { app, BrowserWindow, shell } from 'electron';
import fs from 'fs';
import path from 'path';

export default class WaveCordApp {
  public readonly resourcesPath: string;

  public readonly isDebug: boolean =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  public readonly instanceLock: boolean;

  public window: BrowserWindow | null = null;

  public token: string = '';

  public constructor() {
    app.setPath('userData', path.join(app.getPath('appData'), 'WaveCord'));

    this.resourcesPath = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../../assets');
    this.instanceLock = app.requestSingleInstanceLock();

    if (!this.instanceLock) {
      app.quit();
      return;
    }

    this.loadUser();

    app.on('ready', async () => {
      await this.init();
    });

    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.window === null) await this.init();
    });

    app.on('window-all-closed', () => {
      // Respect the OSX convention of having the application in memory even
      // after all windows have been closed
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  private async init() {
    if (process.env.NODE_ENV === 'production') {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }

    if (this.isDebug) {
      require('electron-debug')();
      await WaveCordApp.installExtensions();
    }

    this.window = new BrowserWindow({
      show: false,
      width: 1280,
      height: 720,
      icon: path.join(this.resourcesPath, 'icon.png'),
      frame: false,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
    });

    this.window.loadURL(WaveCordApp.resolveHtmlPath('index.html'));

    this.window.on('ready-to-show', () => {
      if (!this.window) {
        throw new Error('"window" is not defined');
      }
      this.window.show();
    });

    this.window.on('closed', () => {
      this.window = null;
    });

    this.window.setMenu(null);

    // Open urls in the user's browser
    this.window.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });
  }

  private loadUser() {
    const filePath = `${app.getPath('userData')}//user`;
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '', 'binary');

    this.token = fs.readFileSync(filePath, 'utf8');
  }

  private static resolveHtmlPath(htmlFileName: string) {
    if (process.env.NODE_ENV === 'development') {
      const port = process.env.PORT || 1212;
      const url = new URL(`http://localhost:${port}`);
      url.pathname = htmlFileName;
      return url.href;
    }
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  }

  private static async installExtensions() {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload,
      )
      .catch(console.log);
  }
}
