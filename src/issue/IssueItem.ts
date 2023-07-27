import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Issue } from './Issue';
import { ISSUE_CONTEXT_VALUE } from './constants';

export class IssueItem extends TreeItem {
  public constructor(public readonly issue: Issue, private readonly openCommand: Command) {
    super(IssueItem.shortLabelFrom(issue.title), TreeItemCollapsibleState.None);

    this.setDescription();
    this.setTooltip();

    this.id = issue.id;
    this.contextValue = ISSUE_CONTEXT_VALUE;
    this.command = this.openCommand;
  }

  private static shortLabelFrom(label: string): string {
    const labelMaxLength = 30;
    const shouldRenderDots = label.length > labelMaxLength;
    return `${label.slice(0, labelMaxLength)}${shouldRenderDots ? '…' : ''}`;
  }

  private setDescription(): void {
    this.description = `${this.issue.date.ago}, ${this.issue.amount} times`;
  }

  private setTooltip(): void {
    this.tooltip = [this.issue.title, this.issue.errorMessage].join('\n\n');
  }
}
