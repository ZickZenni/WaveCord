import { ElectronHandler, Logger } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    logger: Logger;
  }
}

export {};
