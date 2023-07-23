import { TreeDataProvider, TreeItem, EventEmitter, Event, window } from 'vscode';
import { List } from './List';
import { Logger } from '../logger';

export class ListDataProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined | null | void> = new EventEmitter<
    TreeItem | undefined | null | void
  >();

  readonly onDidChangeTreeData: Event<TreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  private data: List[] = [];

  constructor(
    private readonly logger: Logger,
    private readonly refreshCb: () => Thenable<List[]>,
    private readonly viewId: string,
  ) {}

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

  async refresh(): Promise<void> {
    const { stopProgress } = this.startProgress();
    this.data = await this.refreshCb();
    this._onDidChangeTreeData.fire();
    stopProgress();
  }

  private startProgress(): { stopProgress: () => void } {
    let resolve: (value: unknown) => void;

    window.withProgress(
      { location: { viewId: this.viewId } },
      () =>
        new Promise(res => {
          resolve = res;
        }),
    );

    return { stopProgress: () => resolve(void 0) };
  }
}
