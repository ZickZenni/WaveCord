/* eslint-disable global-require */
import { app, BrowserWindow, Menu, shell, Tray } from 'electron';
import fs from 'fs';
import path from 'path';
import logger, { Logger } from '../common/log/logger';
import { Client } from '../discord/core/client';
import { GatewaySocketEvent } from '../discord/ws/types';
import { registerHandler, registerListener } from './ipc';

export default class WaveCordApp {
  public readonly resourcesPath: string;

  public readonly isDebug: boolean =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  public readonly instanceLock: boolean;

  public window: BrowserWindow | null = null;

  public tray: Tray | null = null;

  public token: string = '';

  public discord: Client;

  public ready: boolean = false;

  public quitting: boolean = false;

  private rendererLogger = new Logger('renderer');

  public constructor() {
    this.discord = new Client({ debug: true });

    app.setPath('userData', path.join(app.getPath('appData'), 'WaveCord'));

    this.resourcesPath = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../assets');
    this.instanceLock = app.requestSingleInstanceLock();

    logger.info('Starting app...');

    if (!this.instanceLock) {
      this.quit();
      return;
    }

    this.loadUser();

    logger.info('Connecting to discord...');
    this.discord.on('ready', () => {
      logger.info('Discord is ready');
      this.ready = true;
    });
    this.discord.on('dispatch', (event: GatewaySocketEvent) => {
      logger.info('Received event: ', event.event);
    });

    this.discord.login(this.token);

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
        this.quit();
      }
    });
  }

  public quit() {
    this.quitting = true;
    app.quit();
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

    logger.info('Creating new window.');
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
      logger.info('Window ready to be shown.');
      this.window.show();
    });

    this.window.on('close', (event) => {
      if (!this.quitting) {
        event.preventDefault();
        this.window?.hide();
      } else this.window = null;

      return false;
    });

    this.window.setMenu(null);

    // Open urls in the user's browser
    this.window.webContents.setWindowOpenHandler((edata) => {
      const url = new URL(edata.url);
      const port = process.env.PORT || 1212;

      // Prevent opening link that link to the frontend
      if (url.host === `localhost:${port}`) {
        return { action: 'deny' };
      }

      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    registerListener('window:minimize', () => {
      this.window?.minimize();
    });

    registerListener('window:maximize', () => {
      if (this.window === null) return;

      if (this.window.isMaximized()) this.window.unmaximize();
      else this.window.maximize();
    });

    registerListener('logger:info', (...args: any[]) => {
      this.rendererLogger.info(...args);
    });

    registerListener('logger:warn', (...args: any[]) => {
      this.rendererLogger.warn(...args);
    });

    registerListener('logger:error', (...args: any[]) => {
      this.rendererLogger.error(...args);
    });

    registerListener('logger:crit', (...args: any[]) => {
      this.rendererLogger.crit(...args);
    });

    registerListener('logger:debug', (...args: any[]) => {
      this.rendererLogger.debug(...args);
    });

    registerListener('app:exit', () => {
      this.window?.close();
    });

    registerHandler('discord:ready', () => {
      return this.ready;
    });

    registerHandler('discord:user', (userId: string | undefined) => {
      if (userId === undefined) return this.discord.user?.toRaw();

      return null;
    });

    registerHandler('discord:guilds', () => {
      return this.discord.guilds.cache.values().map((v) => v.toRaw());
    });

    registerHandler('discord:channels', (guildId: string) => {
      return this.discord.channels.list(guildId).map((v) => v.toRaw());
    });

    registerHandler('discord:fetch-guild', (id: string) => {
      const guild = this.discord.guilds.cache.get(id);
      return guild ? guild.toRaw() : null;
    });

    registerHandler('discord:load-channel', (channelId: string) => {
      const channel = this.discord.channels.cache.get(channelId);
      return channel ? channel.toRaw() : null;
    });

    registerHandler('discord:fetch-messages', (channelId: string) => {
      const channel = this.discord.channels.cache.get(channelId);
      if (channel === undefined) return [];

      return channel.fetchMessages();
    });
  }

  private initTray() {
    logger.info('Creating new tray.');
    this.tray = new Tray(path.join(this.resourcesPath, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      { type: 'separator' },
      {
        label: 'Show',
        type: 'normal',
        click: () => {
          this.window?.show();
        },
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          this.quit();
        },
      },
    ]);
    this.tray.on('click', () => {
      if (this.window === null) return;

      this.window.show();
    });
    this.tray.setContextMenu(contextMenu);
  }

  private loadUser() {
    logger.info('Loading user token...');

    const filePath = `${app.getPath('userData')}/user`;
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      logger.warn(`'${filePath}'`, 'file not found! Creating empty one...');
    } else {
      logger.info(`'${filePath}'`, 'exists! Reading file...');
      this.token = fs.readFileSync(filePath, 'utf8').replaceAll('\n', '');
      logger.info('Successfully loaded user token!');
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
      .catch(logger.info);
  }
}
