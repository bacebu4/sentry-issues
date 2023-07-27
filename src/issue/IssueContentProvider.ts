import { Command, TextDocumentContentProvider, TextDocumentShowOptions, Uri } from 'vscode';
import { Issue } from './Issue';
import { IIssueGateway } from './IssueGateway';
import { VS_COMMANDS } from '../shared';
import { HumanDate } from '../shared/HumanDate';

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

    const issue = issueResult.data;

    const dateToTuple = (d: HumanDate, title: string): [string, string] => [
      title,
      `${d.toString()} (${d.ago})`,
    ];

    const metaInfo: [string, string][] = [
      dateToTuple(issue.date, 'Latest Date'),
      dateToTuple(issue.firstSeenDate, 'First Seen Date'),
      ['Times', issue.amount.toString()],
      ['Link', issue.link],
    ];

    const longestTitleLength = metaInfo
      .map(([title]) => title.length)
      .reduce((acc, val) => Math.max(acc, val));

    const metaInfoResult = metaInfo
      .map(([title, value]) => `- ${title.padEnd(longestTitleLength + 1)}: ${value}`)
      .join('\n');

    return [
      issue.title,
      issue.errorMessage,
      '\n' + metaInfoResult + '\n',
      issueDetailsResult.data.rawText,
    ].join('\n\n');
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
