import { ExtensionContext } from 'vscode';
import { registerCredentials } from './authentication';
import { registerIssueView } from './issue/registerIssueView';
import { SentryApi } from './sentry-api';

export async function activate(context: ExtensionContext) {
  const sentryApi = new SentryApi();

  const { login } = await registerCredentials(context);

  const credentials = await login();

  if (!credentials) {
    throw new Error();
  }

  sentryApi.setOptions({ host: credentials.instanceUrl, token: credentials.token });

  await registerIssueView(context, sentryApi);
}

export function deactivate() {}
