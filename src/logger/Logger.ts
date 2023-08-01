const LOG_LEVEL = {
  debug: 'DEBUG',
  info: 'INFO',
  warning: 'WARNING',
  error: 'ERROR',
} as const;

type LogLevelValue = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

export class Logger {
  public constructor(
    private readonly context: string,
    private readonly outputPort: (text: string) => void,
  ) {}

  public log(text: string, details?: Record<string, unknown>): void {
    this.logToOutput(LOG_LEVEL.info, text, details);
  }

  public debug(text: string, details?: Record<string, unknown>): void {
    this.logToOutput(LOG_LEVEL.debug, text, details);
  }

  public warn(text: string, details?: Record<string, unknown>): void {
    this.logToOutput(LOG_LEVEL.warning, text, details);
  }

  public error(text: string, details?: Record<string, unknown>): void {
    this.logToOutput(LOG_LEVEL.error, text, details);
  }

  private logToOutput(
    logLevel: LogLevelValue,
    text: string,
    details?: Record<string, unknown>,
  ): void {
    const date = new Date().toISOString();
    const textWithDetails = details ? `${text}\n${JSON.stringify(details, null, 2)}` : text;

    const longestLogLevel = Object.values(LOG_LEVEL)
      .map(l => l.length)
      .reduce((acc, val) => Math.max(acc, val), -Infinity);

    const formattedText = `${date} ${logLevel.padStart(longestLogLevel + 1)} [${
      this.context
    }]: ${textWithDetails}`;

    this.outputPort(formattedText);
  }
}
