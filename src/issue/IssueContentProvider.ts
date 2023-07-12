import { TextDocumentContentProvider, Uri } from 'vscode';
import { Issue } from './Issue';
import { OpenIssueCommand } from './OpenIssueCommand';
import { IssueService } from './IssueService';

export class IssueContentProvider implements TextDocumentContentProvider {
  constructor(private readonly uri: string, private readonly issueService: IssueService) {}

  async provideTextDocumentContent(uri: Uri): Promise<string> {
    const query = this.fromIssueLogUri(uri);
    const issue = await this.issueService.getById(query.issueId);
    return JSON.stringify(issue, null, 2);
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
