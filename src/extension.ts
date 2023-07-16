import { ExtensionContext } from 'vscode';
import { registerCredentials } from './authentication';
import { registerIssueView } from './issue/registerIssueView';
import { Logger } from './logger';
import { SentryApi } from './sentry-api';

export async function activate(context: ExtensionContext) {
  const logger = new Logger('Bootstrap');
  const sentryApi = new SentryApi(new Logger('SentryApi'));

  const { credentials } = await registerCredentials(context);

  if (credentials) {
    sentryApi.setOptions({ host: credentials.instanceUrl, token: credentials.token });
  } else {
    logger.warn('No credentials were provided');
  }

  await registerIssueView(context, sentryApi);
}

export function deactivate() {}
