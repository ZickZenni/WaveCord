import { app } from 'electron';
import path from 'path';

// eslint-disable-next-line import/prefer-default-export
export const resourcesPath = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const assets = `${resourcesPath}/`;
