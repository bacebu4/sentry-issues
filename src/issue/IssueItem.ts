import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Issue } from './Issue';
import { OpenIssueCommand } from './OpenIssueCommand';

export class IssueItem extends TreeItem {
  constructor(private readonly issue: Issue, private readonly openCommand: OpenIssueCommand) {
    super(IssueItem.shortLabelFrom(issue.errorMessage), TreeItemCollapsibleState.None);

    this.setDescription();
    this.setTooltip();

    this.id = issue.id;
    this.contextValue = 'issueItem';

    this.command = this.openCommand;
  }

  private static shortLabelFrom(label: string) {
    const labelMaxLength = 30;
    const shouldRenderDots = label.length > labelMaxLength;
    return `${label.slice(0, labelMaxLength)}${shouldRenderDots ? '…' : ''}`;
  }

  private setTooltip() {
    const labels = this.issue.labels.join('\n');
    this.tooltip = `${this.issue.errorMessage}\n\n${labels}`;
  }

  private setDescription() {
    this.description = `2 h. ago, ${this.issue.amount} times`;
  }
}
