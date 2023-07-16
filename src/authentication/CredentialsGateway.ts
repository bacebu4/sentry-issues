import { ExtensionContext } from 'vscode';
import { Credentials } from './Credentials';

const INSTANCE_URL_KEY = 'sentryInstanceUrl';
const TOKEN_KEY = 'sentry-token';

export class CredentialsGateway {
  constructor(private readonly context: ExtensionContext) {}

  async get() {
    const token = await this.context.secrets.get(TOKEN_KEY);
    const instanceUrl = await this.context.globalState.get<string>(INSTANCE_URL_KEY);

    if (token && instanceUrl) {
      return new Credentials({ instanceUrl, token });
    }
    return null;
  }

  async save(credentials: Credentials) {
    await this.context.secrets.store(TOKEN_KEY, credentials.token);
    await this.context.globalState.update(INSTANCE_URL_KEY, credentials.instanceUrl);
  }

  async remove() {
    await this.context.secrets.delete(TOKEN_KEY);
    await this.context.globalState.update(INSTANCE_URL_KEY, undefined);
  }
}
