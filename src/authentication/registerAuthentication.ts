import * as vscode from 'vscode';
import { CredentialsGateway } from './CredentialsGateway';
import { LoginService } from './LoginService';

export async function registerCredentials(context: vscode.ExtensionContext) {
  const credentialsGateway = new CredentialsGateway(context);
  const loginService = new LoginService(credentialsGateway);

  return {
    login: () => loginService.execute(),
  };
}
