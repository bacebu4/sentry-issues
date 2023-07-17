import { ExtensionContext, commands } from 'vscode';
import { CredentialsGateway } from './CredentialsGateway';
import { LoginService } from './LoginService';
import { Logger } from '../logger';
import { LogoutService } from './LogoutService';

export async function registerCredentials(context: ExtensionContext) {
  const credentialsGateway = new CredentialsGateway(context);

  const loginService = new LoginService(credentialsGateway, new Logger('LoginService'));
  const logoutService = new LogoutService(credentialsGateway);

  const credentials = await credentialsGateway.get();

  context.subscriptions.push(
    commands.registerCommand('sentryIssues.login', () => loginService.execute()),
    commands.registerCommand('sentryIssues.logout', () => logoutService.execute()),
  );

  return {
    credentials: credentials
      ? { instanceUrl: credentials.instanceUrl, token: credentials.token }
      : undefined,
  };
}
