import { ExtensionContext, commands, window } from 'vscode';
import { registerCredentials } from './authentication';
import { registerIssueView } from './issue/registerIssueView';
import { Logger } from './logger';
import { SentryApi } from './sentry-api';
import { COMMANDS } from './issue/constants';

export async function activate(context: ExtensionContext) {
  const outputChannel = window.createOutputChannel('Sentry Issues');
  const createLogger = (context: string) =>
    new Logger(context, (t: string) => outputChannel.appendLine(t));

  const sentryApi = new SentryApi(createLogger('SentryApi'));

  await registerCredentials({
    context,
    createLogger,
    loginOutputPort: async ({ instanceUrl, token }) => {
      sentryApi.setOptions({ host: instanceUrl, token });
      await commands.executeCommand(COMMANDS.refreshIssues);
    },
    logoutOutputPort: async () => {
      sentryApi.setOptions({ host: '', token: '' });
      await commands.executeCommand(COMMANDS.refreshIssues);
    },
  });

  await registerIssueView(context, sentryApi, createLogger);
  await commands.executeCommand('sentryIssues.login');
}

export function deactivate() {}
