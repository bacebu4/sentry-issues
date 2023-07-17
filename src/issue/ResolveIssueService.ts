import { commands, window } from 'vscode';
import { Logger } from '../logger';
import { IIssueGateway } from './IssueGateway';
import { IssueItem } from './IssueItem';
import { ISSUE_COMMANDS } from './constants';

export class ResolveIssueService {
  constructor(private readonly gateway: IIssueGateway, private readonly logger: Logger) {}

  async execute(issueItemOrUnknown: unknown) {
    if (!(issueItemOrUnknown instanceof IssueItem)) {
      this.logger.error(`Got not issue item`);
      return;
    }

    const result = await this.gateway.resolveIssue(issueItemOrUnknown.issue.id);

    if (result.isSuccess) {
      await commands.executeCommand(ISSUE_COMMANDS.refreshIssues);
      return;
    }

    window.showErrorMessage(`Failed to resolve issue. ${result.error.message}`);
  }
}
