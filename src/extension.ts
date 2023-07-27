import { ExtensionContext, commands, window } from 'vscode';
import { AUTHENTICATION_COMMANDS, registerAuthentication } from './authentication';
import { registerIssueView, ISSUE_COMMANDS } from './issue';
import { Logger } from './logger';
import { SentryApi } from './sentry-api';
import { HttpJsonClient } from './http-json-client';

export async function activate(context: ExtensionContext): Promise<void> {
  const outputChannel = window.createOutputChannel('Sentry Issues');

  const createLogger = (context: string): Logger =>
    new Logger(context, (t: string) => outputChannel.appendLine(t));

  const showErrorMessage = async (message: string): Promise<void> => {
    const result = await window.showErrorMessage(message, 'Show Output');
    if (result === 'Show Output') {
      outputChannel.show();
    }
  };

  const httpJsonClient = new HttpJsonClient(createLogger('SentryHttpJsonClient'));
  const sentryApi = new SentryApi(createLogger('SentryApi'), httpJsonClient);

  await registerAuthentication({
    context,
    createLogger,
    loginOutputPort: async ({ instanceUrl, token }) => {
      sentryApi.setOptions({ host: instanceUrl, token });
      await commands.executeCommand(ISSUE_COMMANDS.refreshIssues);
    },
    logoutOutputPort: async () => {
      sentryApi.setOptions({ host: '', token: '' });
      await commands.executeCommand(ISSUE_COMMANDS.refreshIssues);
    },
  });

  await registerIssueView(context, sentryApi, createLogger, showErrorMessage);
  await commands.executeCommand(AUTHENTICATION_COMMANDS.login);
}

export function deactivate(): void {}
