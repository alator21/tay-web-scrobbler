enum LogLevel {
  OFF = 'off',
  INFO = 'info',
  DEBUG = 'debug'
}
const PREFIX = 'tay-web-scrobbler'
class Logger {
  private currentLevel: LogLevel;
  private readonly levels: LogLevel[];

  constructor() {
    this.levels = [LogLevel.OFF, LogLevel.INFO, LogLevel.DEBUG];
    this.currentLevel = LogLevel.INFO;
  }

  setLevel(level: LogLevel): void {
    if (Object.values(LogLevel).includes(level)) {
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
    if (this.currentLevel === LogLevel.OFF) return;

    const levelIndex = this.levels.indexOf(level);
    const currentLevelIndex = this.levels.indexOf(this.currentLevel);

    if (levelIndex <= currentLevelIndex && levelIndex !== 0) {
      const timestamp = new Date().toISOString();
      const formattedMessage = this.formatMessage(message);
      console.log(`[${PREFIX} - ${level.toUpperCase()}] ${timestamp}: ${formattedMessage}`);
    }
  }

  info(message: unknown): void {
    this.log(LogLevel.INFO, message);
  }

  debug(message: unknown): void {
    this.log(LogLevel.DEBUG, message);
  }

  isEnabled(): boolean {
    return this.currentLevel !== LogLevel.OFF;
  }
}

export const logger = new Logger();
logger.setLevel(LogLevel.INFO);
