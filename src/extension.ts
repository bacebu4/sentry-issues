import { ExtensionContext } from 'vscode';
import { registerCredentials } from './authentication';
import { registerIssueView } from './issue/registerIssueView';
import { SentryApi } from './sentry-api';
import { Logger } from './logger';

export async function activate(context: ExtensionContext) {
  const logger = new Logger('Bootstrap');
  const sentryApi = new SentryApi(new Logger('SentryApi'));

  const { login } = await registerCredentials(context);

  const credentials = await login();

  if (!credentials) {
    logger.error('No credentials were provided');
    throw new Error();
  }

  sentryApi.setOptions({ host: credentials.instanceUrl, token: credentials.token });

  await registerIssueView(context, sentryApi);
}

export function deactivate() {}
