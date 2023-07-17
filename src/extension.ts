import { ExtensionContext, window } from 'vscode';
import { registerCredentials } from './authentication';
import { registerIssueView } from './issue/registerIssueView';
import { Logger } from './logger';
import { SentryApi } from './sentry-api';

export async function activate(context: ExtensionContext) {
  const outputChannel = window.createOutputChannel('Sentry Issues');
  const loggerOutputPort = (t: string) => outputChannel.appendLine(t);
  const logger = new Logger('Bootstrap', loggerOutputPort);
  const sentryApi = new SentryApi(new Logger('SentryApi', loggerOutputPort));

  const { credentials } = await registerCredentials(context, loggerOutputPort);

  if (credentials) {
    sentryApi.setOptions({ host: credentials.instanceUrl, token: credentials.token });
  } else {
    logger.warn('No credentials were provided');
  }

  await registerIssueView(context, sentryApi, loggerOutputPort);
}

export function deactivate() {}
