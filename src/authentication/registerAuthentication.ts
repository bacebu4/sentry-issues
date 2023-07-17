import { ExtensionContext, commands } from 'vscode';
import { CredentialsGateway } from './CredentialsGateway';
import { LoginService } from './LoginService';
import { Logger } from '../logger';
import { LogoutService } from './LogoutService';

export async function registerCredentials({
  context,
  loggerOutputPort,
  loginOutputPort,
  logoutOutputPort,
}: {
  context: ExtensionContext;
  loggerOutputPort: (t: string) => void;
  loginOutputPort: (props: { instanceUrl: string; token: string }) => void;
  logoutOutputPort: () => void;
}) {
  const credentialsGateway = new CredentialsGateway(context);

  const loginService = new LoginService(
    credentialsGateway,
    new Logger('LoginService', loggerOutputPort),
    loginOutputPort,
  );
  const logoutService = new LogoutService(credentialsGateway, logoutOutputPort);

  context.subscriptions.push(
    commands.registerCommand('sentryIssues.login', () => loginService.execute()),
    commands.registerCommand('sentryIssues.logout', () => logoutService.execute()),
  );
}
