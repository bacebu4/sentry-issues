import { window } from 'vscode';
import { CredentialsGateway } from './CredentialsGateway';
import { Credentials } from './Credentials';

export class LoginService {
  constructor(private readonly gateway: CredentialsGateway) {}

  async execute(): Promise<{ instanceUrl: string; token: string } | undefined> {
    const credentials = await this.gateway.get();

    if (credentials) {
      return { instanceUrl: credentials.instanceUrl, token: credentials.token };
    }

    const instanceUrl = await window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: 'E.g. https://sentry.io',
      prompt: 'URL to Sentry instance',
      validateInput: v => this.validateInstanceUrl(v),
    });

    if (!instanceUrl) {
      return;
    }

    const token = await window.showInputBox({
      ignoreFocusOut: true,
      password: true,
      placeHolder: 'Paste your Sentry Access Token...',
    });

    if (!token) {
      return;
    }

    await this.gateway.save(new Credentials({ instanceUrl, token }));

    return { instanceUrl, token };
  }

  private validateInstanceUrl(input: string): string | undefined {
    if (!/^https?:\/\/.*$/.test(input)) {
      return 'Must begin with http:// or https://';
    }

    try {
      new URL(input);
      return;
    } catch (e) {
      return 'Must be a valid URL';
    }
  }
}
