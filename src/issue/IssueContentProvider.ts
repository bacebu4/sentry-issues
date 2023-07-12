import { TextDocumentContentProvider, Uri } from 'vscode';
import { Issue } from './Issue';
import { OpenIssueCommand } from './OpenIssueCommand';

export class IssueContentProvider implements TextDocumentContentProvider {
  constructor(private readonly uri: string) {}

  provideTextDocumentContent(uri: Uri): string {
    const query = this.fromIssueLogUri(uri);
    return `hello from issue scheme, query: ${JSON.stringify(query)}`;
  }

  createOpenCommandForIssue(issue: Issue) {
    return new OpenIssueCommand(this.toIssueLogUri(issue.id));
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
