/* eslint-disable global-require */
import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron';
import fs from 'fs';
import path from 'path';
import { DiscordClient } from '../common/discord/client/client';
import logger from '../common/logger';
import GatewayEvent from '../common/discord/gateway/event';

export default class WaveCordApp {
  public readonly resourcesPath: string;

  public readonly isDebug: boolean =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  public readonly instanceLock: boolean;

  public window: BrowserWindow | null = null;

  public tray: Tray | null = null;

  public token: string = '';

  public discord: DiscordClient | null = null;

  public constructor() {
    app.setPath('userData', path.join(app.getPath('appData'), 'WaveCord'));

    this.resourcesPath = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../assets');
    this.instanceLock = app.requestSingleInstanceLock();

    logger.init();
    logger.log('Starting app...');

    if (!this.instanceLock) {
      app.quit();
      return;
    }

    this.loadUser();

    logger.log('Connecting to discord...');
    this.discord = new DiscordClient(this.token);

    this.discord.on('connect', () => {
      logger.log('Discord is ready.');
      this.discord!.ready = true;
    });

    this.discord.on('event', (event: GatewayEvent) => {
      logger.log('Received discord event: ', event.event);
    });

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

    logger.log('Creating new window.');
    this.window = new BrowserWindow({
      show: false,
      width: 1250,
      height: 697,
      minWidth: 450,
      minHeight: 250,
      icon: path.join(this.resourcesPath, 'icon.png'),
      frame: false,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
    });

    this.initTray();

    this.window.loadURL(WaveCordApp.resolveHtmlPath('index.html'));

    this.window.on('ready-to-show', () => {
      if (!this.window) {
        throw new Error('"window" is not defined');
      }
      logger.log('Window ready to be shown.');
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

    /* Window Ipc */
    ipcMain.on('WINDOW_MINIMIZE', () => {
      this.window?.minimize();
    });

    ipcMain.on('WINDOW_MAXIMIZE', () => {
      if (this.window === null) return;

      if (this.window.isMaximized()) this.window.unmaximize();
      else this.window.maximize();
    });

    /* App Ipc */
    ipcMain.on('APP_EXIT', () => {
      app.exit();
    });

    /* Discord Ipc */
    ipcMain.handle('DISCORD_READY', () => {
      return this.discord ? this.discord.ready : false;
    });

    ipcMain.handle('DISCORD_GET_GUILDS', () => {
      return this.discord ? this.discord.guilds.getGuilds() : [];
    });

    ipcMain.handle('DISCORD_LOAD_GUILD', (_, id: string) => {
      return this.discord
        ? this.discord.guilds.getGuilds().find((v) => v.id === id)
        : [];
    });

    ipcMain.on(
      'DISCORD_SET_LAST_VISITED_GUILD_CHANNEL',
      (_, channelId: string) => {
        const channel = this.discord
          ? this.discord.getChannel(channelId)
          : null;
        if (channel === null) return;

        const guild = this.discord
          ? (this.discord.guilds
              .getGuilds()
              .find((v) => v.id === channel.guildId) ?? null)
          : null;

        if (guild === null) return;

        logger.log('Set last visited channel for guild', guild.id, channel.id);
        guild.lastVisitedChannel = channelId;
      },
    );
  }

  private initTray() {
    logger.log('Creating new tray.');
    this.tray = new Tray(path.join(this.resourcesPath, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      { type: 'separator' },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          app.quit();
        },
      },
    ]);
    this.tray.setContextMenu(contextMenu);
  }

  private loadUser() {
    logger.log('Loading user token...');

    const filePath = `${app.getPath('userData')}/user`;
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      logger.warn(`'${filePath}'`, 'file not found! Creating empty one...');
    } else {
      logger.log(`'${filePath}'`, 'exists! Reading file...');
      this.token = fs.readFileSync(filePath, 'utf8').replaceAll('\n', '');
      logger.log('Successfully loaded user token!');
    }
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
      .catch(logger.log);
  }
}
