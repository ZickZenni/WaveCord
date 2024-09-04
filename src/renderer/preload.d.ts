import { ElectronHandler, LoggerHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    logger: LoggerHandler;
  }
}

export {};
