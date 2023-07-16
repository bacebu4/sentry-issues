import { ExtensionContext, commands } from 'vscode';
import { Credentials } from './Credentials';

const INSTANCE_URL_KEY = 'sentryInstanceUrl';
const TOKEN_KEY = 'sentry-token';

export class CredentialsGateway {
  constructor(private readonly context: ExtensionContext) {}

  async get() {
    const token = await this.context.secrets.get(TOKEN_KEY);
    const instanceUrl = await this.context.globalState.get<string>(INSTANCE_URL_KEY);

    if (token && instanceUrl) {
      await this.setContextForPresenceOfCredentials(true);
      return new Credentials({ instanceUrl, token });
    }

    await this.setContextForPresenceOfCredentials(false);
    return null;
  }

  async save(credentials: Credentials) {
    await this.context.secrets.store(TOKEN_KEY, credentials.token);
    await this.context.globalState.update(INSTANCE_URL_KEY, credentials.instanceUrl);
    await this.setContextForPresenceOfCredentials(true);
  }

  async remove() {
    await this.context.secrets.delete(TOKEN_KEY);
    await this.context.globalState.update(INSTANCE_URL_KEY, undefined);
    await this.setContextForPresenceOfCredentials(false);
  }

  private async setContextForPresenceOfCredentials(presence: boolean) {
    await commands.executeCommand('setContext', 'sentryIssues.noCredentials', !presence);
  }
}
