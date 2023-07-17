import { Uri, commands } from 'vscode';
import { Logger } from '../logger';
import { IssueItem } from './IssueItem';
import { VS_COMMANDS } from '../shared';

export class OpenIssueInBrowserService {
  constructor(private readonly logger: Logger) {}

  async execute(issueItemOrUnknown: unknown) {
    if (!(issueItemOrUnknown instanceof IssueItem)) {
      this.logger.error(`Got not issue item`);
      return;
    }

    await commands.executeCommand(VS_COMMANDS.open, Uri.parse(issueItemOrUnknown.issue.link));
  }
}
