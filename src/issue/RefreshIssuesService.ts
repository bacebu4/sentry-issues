import { window } from 'vscode';
import { IIssueGateway } from './IssueGateway';
import { IssueList } from './IssueList';
import { Logger } from '../logger';

export class RefreshIssuesService {
  constructor(
    private readonly gateway: IIssueGateway,
    private readonly outputPort: (list: IssueList) => void,
    private readonly logger: Logger,
  ) {}

  async execute() {
    this.logger.debug('Start refreshing');

    if (!this.gateway.isInReadyState) {
      this.logger.debug('Not in ready state');
      this.outputPort([]);
      return;
    }

    const issueListResult = await this.gateway.getIssueList();

    if (issueListResult.isSuccess) {
      this.outputPort(issueListResult.data);
      return;
    }

    window.showErrorMessage(`Failed retrieving issues list. ${issueListResult.error.message}`);
  }
}
