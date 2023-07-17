import { CredentialsGateway } from './CredentialsGateway';

export class LogoutService {
  constructor(
    private readonly gateway: CredentialsGateway,
    private readonly outputPort: () => void,
  ) {}

  async execute(): Promise<void> {
    await this.gateway.remove();
    this.outputPort();
  }
}
