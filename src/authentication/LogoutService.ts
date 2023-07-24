import { CredentialsGateway } from './CredentialsGateway';

export class LogoutService {
  public constructor(
    private readonly gateway: CredentialsGateway,
    private readonly outputPort: () => void,
  ) {}

  public async execute(): Promise<void> {
    await this.gateway.remove();
    this.outputPort();
  }
}
