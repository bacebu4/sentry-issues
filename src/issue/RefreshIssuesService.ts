import { window } from 'vscode';
import { IIssueGateway } from './IssueGateway';
import { IssueList } from './IssueList';

export class RefreshIssuesService {
  constructor(
    private readonly gateway: IIssueGateway,
    private readonly outputPort: (list: IssueList) => void,
  ) {}

  async execute() {
    if (!this.gateway.isInReadyState) {
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
