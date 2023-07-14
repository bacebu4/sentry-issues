import { Command, TextDocumentContentProvider, TextDocumentShowOptions, Uri } from 'vscode';
import { Issue } from './Issue';
import { IIssueGateway } from './IssueGateway';
import { VS_COMMANDS } from '../shared';

export class IssueContentProvider implements TextDocumentContentProvider {
  constructor(private readonly uriScheme: string, private readonly issueGateway: IIssueGateway) {}

  async provideTextDocumentContent(uri: Uri): Promise<string> {
    const { issueId } = this.deserializeUri(uri);

    const [issue, issueDetails] = await Promise.all([
      this.issueGateway.getIssueById(issueId),
      this.issueGateway.getIssueDetails(issueId),
    ]);

    const metaInfo = [
      `Latest Date: ${issue.date.toLocaleString()}`,
      `Times: ${issue.amount}`,
      `Link: ${issue.link}`,
    ]
      .map(l => `- ${l}`)
      .join('\n');

    return [issue.title, issue.errorMessage, metaInfo, issueDetails.rawText].join('\n\n');
  }

  createOpenCommandForIssue(issue: Issue): Command {
    return {
      title: 'Open Issue',
      command: VS_COMMANDS.open,
      arguments: [this.serializeUri(issue.id), { preview: true } satisfies TextDocumentShowOptions],
    };
  }

  private serializeUri(issueId: string): Uri {
    const query = { issueId };

    return Uri.parse(`${this.uriScheme}:${this.getPageTitle(issueId)}`).with({
      query: JSON.stringify(query),
    });
  }

  private getPageTitle(issueId: string) {
    return `Issue ${issueId}`;
  }

  private deserializeUri(uri: Uri): { issueId: string } {
    const { issueId } = JSON.parse(uri.query);
    return { issueId };
  }
}
