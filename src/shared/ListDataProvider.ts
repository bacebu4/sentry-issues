import {
  TreeDataProvider,
  TreeItem,
  EventEmitter,
  Event,
  window,
  TreeItemCollapsibleState,
} from 'vscode';
import { List } from './List';
import { Logger } from '../logger';
import { HumanDate } from './HumanDate';

type Maybe<T> = T | undefined | null | void;

export class ListDataProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<Maybe<TreeItem>> = new EventEmitter<Maybe<TreeItem>>();

  public readonly onDidChangeTreeData: Event<Maybe<TreeItem>> = this._onDidChangeTreeData.event;

  private data: List[] = [];

  private lastFetchedOn: HumanDate = HumanDate.now();

  public get lastFetched(): HumanDate {
    return this.lastFetchedOn;
  }

  private get hasOnlyOneTreeItem(): boolean {
    const firstData = this.data.at(0);
    return Boolean(firstData) && this.data.length <= 1;
  }

  public constructor(
    private readonly logger: Logger,
    private readonly refreshCb: () => Thenable<List[]>,
    private readonly viewId: string,
  ) {}

  public getChildren(element?: TreeItem): TreeItem[] {
    if (!element) {
      return this.data;
    }

    if (element instanceof List) {
      return element.children;
    }

    this.logger.error('Got element which is not instance of list');

    return [];
  }

  public getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  public async refresh(): Promise<void> {
    const { stopProgress } = this.startProgress();
    this.data = await this.refreshCb();
    this.lastFetchedOn = HumanDate.now();

    if (this.hasOnlyOneTreeItem) {
      this.expandFirstTreeItem();
    }

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

  private expandFirstTreeItem(): void {
    const firstData = this.data.at(0);

    if (firstData) {
      firstData.collapsibleState = TreeItemCollapsibleState.Expanded;
    }
  }
}
