import { commands } from 'vscode';
import { VS_COMMANDS } from '../shared';
import { IIssueGateway } from './IssueGateway';

export class OpenAllIssuesInBrowserService {
  public constructor(
    private readonly issueGateway: IIssueGateway,
    private readonly showWarningMessage: (m: string) => void,
  ) {}

  public async execute(): Promise<void> {
    if (!this.issueGateway.instanceUrl) {
      return this.showWarningMessage('No instance url was provided');
    }

    await commands.executeCommand(VS_COMMANDS.open, this.issueGateway.instanceUrl);
  }
}
