import { Logger } from '../logger';
import { CredentialsGateway } from './CredentialsGateway';

export class LogoutService {
  constructor(private readonly gateway: CredentialsGateway) {}

  async execute(): Promise<void> {
    await this.gateway.remove();
  }
}
