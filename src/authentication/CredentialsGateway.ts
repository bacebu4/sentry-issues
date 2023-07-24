import { ExtensionContext, commands } from 'vscode';
import { Credentials } from './Credentials';

const INSTANCE_URL_KEY = 'sentryInstanceUrl';
const TOKEN_KEY = 'sentry-token';

export class CredentialsGateway {
  public constructor(private readonly context: ExtensionContext) {}

  public async get(): Promise<Credentials | null> {
    const token = await this.context.secrets.get(TOKEN_KEY);
    const instanceUrl = await this.context.globalState.get<string>(INSTANCE_URL_KEY);

    if (token && instanceUrl) {
      await this.setContextForPresenceOfCredentials(true);
      return new Credentials({ instanceUrl, token });
    }

    await this.setContextForPresenceOfCredentials(false);
    return null;
  }

  public async save(credentials: Credentials): Promise<void> {
    await this.context.secrets.store(TOKEN_KEY, credentials.token);
    await this.context.globalState.update(INSTANCE_URL_KEY, credentials.instanceUrl);
    await this.setContextForPresenceOfCredentials(true);
  }

  public async remove(): Promise<void> {
    await this.context.secrets.delete(TOKEN_KEY);
    await this.context.globalState.update(INSTANCE_URL_KEY, undefined);
    await this.setContextForPresenceOfCredentials(false);
  }

  private async setContextForPresenceOfCredentials(presence: boolean): Promise<void> {
    await commands.executeCommand('setContext', 'sentryIssues.noCredentials', !presence);
  }
}
