import { ExtensionContext, commands } from 'vscode';
import { CredentialsGateway } from './CredentialsGateway';
import { LoginService } from './LoginService';
import { Logger } from '../logger';

export async function registerCredentials(context: ExtensionContext) {
  const credentialsGateway = new CredentialsGateway(context);
  const loginService = new LoginService(credentialsGateway, new Logger('LoginService'));

  const credentials = await credentialsGateway.get();

  if (!credentials) {
    await commands.executeCommand('setContext', 'sentryIssues.noCredentials', true);
  } else {
    await commands.executeCommand('setContext', 'sentryIssues.noCredentials', false);
  }

  context.subscriptions.push(
    commands.registerCommand('sentryIssues.login', async () => {
      await loginService.execute();
    }),
  );

  return {
    credentials: credentials
      ? { instanceUrl: credentials.instanceUrl, token: credentials.token }
      : undefined,
  };
}
