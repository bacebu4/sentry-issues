import { commands } from 'vscode';
import { Logger } from '../logger';
import { IIssueGateway } from './IssueGateway';
import { IssueItem } from './IssueItem';
import { ISSUE_COMMANDS } from './constants';

export class ResolveIssueService {
  public constructor(
    private readonly gateway: IIssueGateway,
    private readonly logger: Logger,
    private readonly showErrorMessage: (message: string) => void,
  ) {}

  public async execute(issueItemOrUnknown: unknown): Promise<void> {
    if (!(issueItemOrUnknown instanceof IssueItem)) {
      this.logger.error(`Got not issue item`);
      return;
    }

    const result = await this.gateway.resolveIssue(issueItemOrUnknown.issue.id);

    if (result.isSuccess) {
      await commands.executeCommand(ISSUE_COMMANDS.refreshIssues);
      return;
    }

    this.showErrorMessage(`Failed to resolve issue. ${result.error.message}`);
  }
}
