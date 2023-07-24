import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class List extends TreeItem {
  public constructor(private readonly props: { label: string; children: TreeItem[] }) {
    super(props.label, TreeItemCollapsibleState.Collapsed);
    this.id = props.label;
  }

  public get children(): TreeItem[] {
    return this.props.children;
  }
}
