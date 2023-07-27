import { window } from 'vscode';
import { ListDataProvider } from './ListDataProvider';

export const createTreeView = (listDataProvider: ListDataProvider, viewId: string): void => {
  listDataProvider.onDidChangeTreeData(() => {
    setLastFetched();
  });

  const treeView = window.createTreeView(viewId, {
    treeDataProvider: listDataProvider,
    showCollapseAll: true,
  });

  const setLastFetched = (): void =>
    void (treeView.description = `Last fetched ${listDataProvider.lastFetched.approximateAgo}`);

  const MINUTE_IN_MS = 60_000;
  setInterval(setLastFetched, MINUTE_IN_MS);
};
