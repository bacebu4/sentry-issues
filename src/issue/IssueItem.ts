import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Issue } from './Issue';
import { OpenIssueCommand } from './OpenIssueCommand';
import { formatDistanceToNowStrict } from 'date-fns';

export class IssueItem extends TreeItem {
  constructor(private readonly issue: Issue, private readonly openCommand: OpenIssueCommand) {
    super(IssueItem.shortLabelFrom(issue.errorMessage), TreeItemCollapsibleState.None);

    this.setDescription();

    this.id = issue.id;
    this.tooltip = this.issue.errorMessage;
    this.contextValue = 'issueItem';

    this.command = this.openCommand;
  }

  private static shortLabelFrom(label: string) {
    const labelMaxLength = 30;
    const shouldRenderDots = label.length > labelMaxLength;
    return `${label.slice(0, labelMaxLength)}${shouldRenderDots ? '…' : ''}`;
  }

  private setDescription() {
    const formattedTime = formatDistanceToNowStrict(this.issue.date);
    this.description = `${formattedTime}, ${this.issue.amount} times`;
  }
}
