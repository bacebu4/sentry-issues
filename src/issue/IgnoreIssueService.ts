import { commands } from 'vscode';
import { Logger } from '../logger';
import { IIssueGateway } from './IssueGateway';
import { IssueItem } from './IssueItem';
import { ISSUE_COMMANDS } from './constants';

export class IgnoreIssueService {
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

    const result = await this.gateway.ignoreIssue(issueItemOrUnknown.issue.id);

    if (result.isSuccess) {
      await commands.executeCommand(ISSUE_COMMANDS.refreshIssues);
      return;
    }

    this.showErrorMessage(`Failed to ignore issue. ${result.error.message}`);
  }
}
