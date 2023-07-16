import { exhaustiveMatchingGuard } from '../utils';

const LOG_LEVEL = {
  debug: 'DEBUG',
  info: 'INFO',
  warning: 'WARNING',
  error: 'ERROR',
} as const;

type LogLevelValue = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

export class Logger {
  constructor(private readonly context: string) {}

  log(text: string, details?: Record<string, unknown>) {
    this.logToConsole(LOG_LEVEL.info, text, details);
  }

  debug(text: string, details?: Record<string, unknown>) {
    this.logToConsole(LOG_LEVEL.debug, text, details);
  }

  warn(text: string, details?: Record<string, unknown>) {
    this.logToConsole(LOG_LEVEL.warning, text, details);
  }

  error(text: string, details?: Record<string, unknown>) {
    this.logToConsole(LOG_LEVEL.error, text, details);
  }

  private logToConsole(logLevel: LogLevelValue, text: string, details?: Record<string, unknown>) {
    const date = new Date().toISOString();
    const padNextLines = (text: string) => text.replace(/\n/g, `\n${' '.repeat(4)}`);
    const textWithDetails = details ? `${text}\n${JSON.stringify(details, null, 2)}` : text;
    const formattedText = `${date} ${logLevel} [${this.context}]: ${padNextLines(textWithDetails)}`;

    switch (logLevel) {
      case LOG_LEVEL.error:
        console.error(formattedText);
        break;

      case LOG_LEVEL.debug:
        console.debug(formattedText);
        break;

      case LOG_LEVEL.info:
        console.info(formattedText);
        break;

      case LOG_LEVEL.warning:
        console.warn(formattedText);
        break;

      default:
        return exhaustiveMatchingGuard(logLevel);
    }
  }
}