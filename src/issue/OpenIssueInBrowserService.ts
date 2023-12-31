import { Uri, commands } from 'vscode';
import { Logger } from '../logger';
import { IssueItem } from './IssueItem';
import { VS_COMMANDS } from '../shared';

export class OpenIssueInBrowserService {
  public constructor(private readonly logger: Logger) {}

  public async execute(issueItemOrUnknown: unknown): Promise<void> {
    if (!(issueItemOrUnknown instanceof IssueItem)) {
      this.logger.error(`Got not issue item`);
      return;
    }

    await commands.executeCommand(VS_COMMANDS.open, Uri.parse(issueItemOrUnknown.issue.link));
  }
}
