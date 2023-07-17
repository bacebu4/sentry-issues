import { ExtensionContext, commands } from 'vscode';
import { CredentialsGateway } from './CredentialsGateway';
import { LoginService } from './LoginService';
import { Logger } from '../logger';
import { LogoutService } from './LogoutService';
import { AUTHENTICATION_COMMANDS } from './constants';

export async function registerCredentials({
  context,
  loginOutputPort,
  logoutOutputPort,
  createLogger,
}: {
  context: ExtensionContext;
  loginOutputPort: (props: { instanceUrl: string; token: string }) => void;
  logoutOutputPort: () => void;
  createLogger: (context: string) => Logger;
}) {
  const credentialsGateway = new CredentialsGateway(context);

  const loginService = new LoginService(
    credentialsGateway,
    createLogger('LoginService'),
    loginOutputPort,
  );
  const logoutService = new LogoutService(credentialsGateway, logoutOutputPort);

  context.subscriptions.push(
    commands.registerCommand(AUTHENTICATION_COMMANDS.login, () => loginService.execute()),
    commands.registerCommand(AUTHENTICATION_COMMANDS.logout, () => logoutService.execute()),
  );
}
