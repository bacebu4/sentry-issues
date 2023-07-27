import { env } from 'vscode';
import { Logger } from '../logger';
import { IssueItem } from './IssueItem';

export class CopyIssueLinkService {
  public constructor(private readonly logger: Logger) {}

  public async execute(issueItemOrUnknown: unknown): Promise<void> {
    if (!(issueItemOrUnknown instanceof IssueItem)) {
      this.logger.error(`Got not issue item`);
      return;
    }

    await env.clipboard.writeText(issueItemOrUnknown.issue.link);
  }
}
