import { Command, TextDocumentContentProvider, TextDocumentShowOptions, Uri } from 'vscode';
import { Issue } from './Issue';
import { IIssueGateway } from './IssueGateway';
import { VS_COMMANDS } from '../shared';

type IssueUriQuery = {
  issueId: string;
};

export class IssueContentProvider implements TextDocumentContentProvider {
  constructor(private readonly uriScheme: string, private readonly issueGateway: IIssueGateway) {}

  async provideTextDocumentContent(uri: Uri): Promise<string> {
    const { issueId } = this.deserializeUri(uri);

    const [issueResult, issueDetailsResult] = await Promise.all([
      this.issueGateway.getIssueById(issueId),
      this.issueGateway.getIssueDetails(issueId),
    ]);

    if (!issueResult.isSuccess) {
      return 'Error';
    }

    if (!issueDetailsResult.isSuccess) {
      return 'Error';
    }

    const metaInfo = [
      `Latest Date: ${issueResult.data.date.toLocaleString()}`,
      `Times: ${issueResult.data.amount}`,
      `Link: ${issueResult.data.link}`,
    ]
      .map(l => `- ${l}`)
      .join('\n');

    return [
      issueResult.data.title,
      issueResult.data.errorMessage,
      metaInfo,
      issueDetailsResult.data.rawText,
    ].join('\n\n');
  }

  createOpenCommandForIssue(issue: Issue): Command {
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

  private getPageTitle(issueId: string) {
    return `Issue ${issueId}`;
  }

  private deserializeUri(uri: Uri): IssueUriQuery {
    return JSON.parse(uri.query);
  }
}
