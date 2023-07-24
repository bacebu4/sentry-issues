import { Logger } from '../logger';
import { IIssueGateway } from './IssueGateway';
import { IssueList } from './IssueList';

export class RefreshIssuesService {
  public constructor(
    private readonly gateway: IIssueGateway,
    private readonly logger: Logger,
    private readonly showErrorMessage: (message: string) => void,
  ) {}

  public async execute(): Promise<IssueList> {
    this.logger.debug('Start refreshing');

    if (!this.gateway.isInReadyState) {
      this.logger.debug('Not in ready state');
      return [];
    }

    const issueListResult = await this.gateway.getIssueList();

    if (issueListResult.isSuccess) {
      return issueListResult.data;
    }

    this.showErrorMessage(`Failed retrieving issues list. ${issueListResult.error.message}`);

    return [];
  }
}
