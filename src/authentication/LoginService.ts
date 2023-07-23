import { window } from 'vscode';
import { CredentialsGateway } from './CredentialsGateway';
import { Credentials } from './Credentials';
import { Logger } from '../logger';

export class LoginService {
  constructor(
    private readonly gateway: CredentialsGateway,
    private readonly logger: Logger,
    private readonly loginOutputPort: (props: { instanceUrl: string; token: string }) => void,
  ) {}

  async execute(): Promise<void> {
    const credentials = await this.gateway.get();

    if (credentials) {
      this.loginOutputPort({ instanceUrl: credentials.instanceUrl, token: credentials.token });
      return;
    }

    const instanceUrl = await window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: 'E.g. https://sentry.io',
      prompt: 'URL to Sentry instance',
      validateInput: v => this.validateInstanceUrl(v),
    });

    if (!instanceUrl) {
      this.logger.warn('Instance url was not provided');
      return;
    }

    const token = await window.showInputBox({
      ignoreFocusOut: true,
      password: true,
      placeHolder: 'Paste your Sentry Access Token...',
    });

    if (!token) {
      this.logger.warn('Token was not provided');
      return;
    }

    await this.gateway.save(new Credentials({ instanceUrl, token }));

    this.loginOutputPort({ instanceUrl, token });
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
