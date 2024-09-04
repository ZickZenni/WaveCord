import picocolors from 'picocolors';
import moment from 'moment';

enum LogType {
  Info,
  Warn,
  Error,
  Crit,
  Debug,
}

export class Logger {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  private handleArgs(...args: any[]): string {
    const messages: string[] = [];

    for (let i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if (typeof arg !== 'object') {
        messages.push(arg);
        continue;
      }

      messages.push(JSON.stringify(arg));
    }
    return messages.join(' ');
  }

  private logConsole(type: LogType, ...args: any[]) {
    const now = moment();

    let message = '';
    message += now.toString().slice(0, 3);
    message += ', ';
    message += picocolors.red(now.day());
    message += ' ';
    message += now.toString().slice(4, 7);
    message += ' ';
    message += picocolors.red(now.year());
    message += ' ';
    message += picocolors.gray(now.format('hh:mm:ss'));
    message += ' | ';
    message += LogType[type];
    message += ' | ';
    message += picocolors.red(this.name.padEnd(16, ' '));
    message += ' | ';
    message += this.handleArgs(...args);

    console.log(message);
  }

  public info(...args: any[]): void {
    this.logConsole(LogType.Info, ...args);
  }

  public warn(...args: any[]): void {
    this.logConsole(LogType.Warn, ...args);
  }

  public error(...args: any[]): void {
    this.logConsole(LogType.Error, ...args);
  }

  public crit(...args: any[]): void {
    this.logConsole(LogType.Crit, ...args);
  }

  public debug(...args: any[]): void {
    this.logConsole(LogType.Debug, ...args);
  }
}

const logger = new Logger('main');
export default logger;
