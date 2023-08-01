import { Command, TextDocumentContentProvider, TextDocumentShowOptions, Uri } from 'vscode';
import { Issue } from './Issue';
import { IIssueGateway } from './IssueGateway';
import { VS_COMMANDS } from '../shared';
import { IssueContent } from './IssueContent';

type IssueUriQuery = {
  issueId: string;
};

export class IssueContentProvider implements TextDocumentContentProvider {
  public constructor(
    private readonly uriScheme: string,
    private readonly issueGateway: IIssueGateway,
  ) {}

  private get fileExtension(): string {
    return 'log';
  }

  public async provideTextDocumentContent(uri: Uri): Promise<string> {
    const { issueId } = this.deserializeUri(uri);

    const [issueResult, issueDetailsResult] = await Promise.all([
      this.issueGateway.getIssueById(issueId),
      this.issueGateway.getIssueDetails(issueId),
    ]);

    const baseErrorMessage = 'Error occurred during retrieving issue content';

    if (!issueResult.isSuccess) {
      return `${baseErrorMessage}. ${issueResult.error.message}`;
    }

    if (!issueDetailsResult.isSuccess) {
      return `${baseErrorMessage}. ${issueDetailsResult.error.message}`;
    }

    return new IssueContent(issueResult.data, issueDetailsResult.data).toString();
  }

  public createOpenCommandForIssue(issue: Issue): Command {
    return {
      title: 'Open Issue',
      command: VS_COMMANDS.open,
      arguments: [this.serializeUri(issue.id), { preview: true } satisfies TextDocumentShowOptions],
    };
  }

  private serializeUri(issueId: string): Uri {
    const query: IssueUriQuery = { issueId };

    return Uri.parse(`${this.uriScheme}:${this.getPageTitle(issueId)}`).with({
      query: JSON.stringify(query),
    });
  }

  private getPageTitle(issueId: string): string {
    const name = `issue_${issueId}`;
    return [name, this.fileExtension].join('.');
  }

  private deserializeUri(uri: Uri): IssueUriQuery {
    return JSON.parse(uri.query);
  }
}
