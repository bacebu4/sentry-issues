import { window } from 'vscode';
import { Logger } from '../logger';
import { IIssueGateway } from './IssueGateway';

export class RefreshIssuesService {
  constructor(private readonly gateway: IIssueGateway, private readonly logger: Logger) {}

  async execute() {
    this.logger.debug('Start refreshing');

    if (!this.gateway.isInReadyState) {
      this.logger.debug('Not in ready state');
      return [];
    }

    const issueListResult = await this.gateway.getIssueList();

    if (issueListResult.isSuccess) {
      return issueListResult.data;
    }

    window.showErrorMessage(`Failed retrieving issues list. ${issueListResult.error.message}`);

    return [];
  }
}
