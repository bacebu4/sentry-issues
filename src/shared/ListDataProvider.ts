import { TreeDataProvider, TreeItem, EventEmitter, Event } from 'vscode';
import { List } from './List';
import { Logger } from '../logger';

export class ListDataProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined | null | void> = new EventEmitter<
    TreeItem | undefined | null | void
  >();

  readonly onDidChangeTreeData: Event<TreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private data: List[], private readonly logger: Logger) {}

  getChildren(element?: TreeItem): TreeItem[] {
    if (!element) {
      return this.data;
    }

    if (element instanceof List) {
      return element.children;
    }

    this.logger.error('Got element which is not instance of list');

    return [];
  }

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  refresh(newData: List[]): void {
    this.data = newData;
    this._onDidChangeTreeData.fire();
  }
}
