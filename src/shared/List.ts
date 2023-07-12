import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class List extends TreeItem {
  constructor(private readonly props: { label: string; children: TreeItem[] }) {
    super(props.label, TreeItemCollapsibleState.Collapsed);
    this.id = props.label;
  }

  get children() {
    return this.props.children;
  }
}
