export type LogLevel = 'off' | 'info' | 'debug'

const PREFIX = 'tay-web-scrobbler'
class Logger {
  private currentLevel: LogLevel;
  private readonly levels: LogLevel[];

  constructor() {
    this.levels = ['off', 'info', 'debug'];
    this.currentLevel = 'info';
  }

  setLevel(level: LogLevel): void {
    if (this.levels.includes(level)) {
      this.currentLevel = level;
    } else {
      console.error(`Invalid log level: ${level}`);
    }
  }

  private formatMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }
    try {
      return JSON.stringify(message, null, 2);
    } catch {
      return String(message);
    }
  }
  private log(level: LogLevel, message: unknown): void {
    if (this.currentLevel === 'off') return;

    const levelIndex = this.levels.indexOf(level);
    const currentLevelIndex = this.levels.indexOf(this.currentLevel);

    if (levelIndex <= currentLevelIndex && levelIndex !== 0) {
      const timestamp = new Date().toISOString();
      const formattedMessage = this.formatMessage(message);
      console.log(`[${PREFIX} - ${level.toUpperCase()}] ${timestamp}: ${formattedMessage}`);
    }
  }

  info(message: unknown): void {
    this.log('info', message);
  }

  debug(message: unknown): void {
    this.log('debug', message);
  }

  isEnabled(): boolean {
    return this.currentLevel !== 'off';
  }
}

export const logger = new Logger();
