import * as vscode from 'vscode';
import { CredentialsGateway } from './CredentialsGateway';
import { LoginService } from './LoginService';
import { Logger } from '../logger';

export async function registerCredentials(context: vscode.ExtensionContext) {
  const credentialsGateway = new CredentialsGateway(context);
  const loginService = new LoginService(credentialsGateway, new Logger('LoginService'));

  return {
    login: () => loginService.execute(),
  };
}
