import { Command, TextDocumentContentProvider, TextDocumentShowOptions, Uri } from 'vscode';
import { Issue } from './Issue';
import { IIssueGateway } from './IssueGateway';
import { VS_COMMANDS } from '../shared';

export class IssueContentProvider implements TextDocumentContentProvider {
  constructor(private readonly uri: string, private readonly issueService: IIssueGateway) {}

  async provideTextDocumentContent(uri: Uri): Promise<string> {
    const query = this.fromIssueLogUri(uri);
    const issue = await this.issueService.getIssueById(query.issueId);
    return JSON.stringify(issue, null, 2);
  }

  createOpenCommandForIssue(issue: Issue): Command {
    return {
      title: 'Open Issue',
      command: VS_COMMANDS.open,
      arguments: [
        this.toIssueLogUri(issue.id),
        { preview: true } satisfies TextDocumentShowOptions,
      ],
    };
  }

  private toIssueLogUri(issueId: string): Uri {
    const query = { issueId };
    const title = `Issue ${issueId}`;

    return Uri.parse(`${this.uri}:${title}`).with({
      query: JSON.stringify(query),
    });
  }

  private fromIssueLogUri(uri: Uri): { issueId: string } {
    const { issueId } = JSON.parse(uri.query);
    return { issueId };
  }
}
