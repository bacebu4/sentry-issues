import { ExtensionContext, window, commands, workspace } from 'vscode';
import { IssueItem } from './IssueItem';
import { IssueContentProvider } from './IssueContentProvider';
import { IssueToListTranslator } from './IssueToListTranslator';
import { issueListFixture1, issueListFixture2 } from './issueListFixture';
import { ListDataProvider } from '../shared';
import { IssueService } from './IssueService';

export const registerIssueView = (context: ExtensionContext) => {
  const ISSUE_LOG_URI_SCHEME = 'sentry-issue-log';

  const issueContentProvider = new IssueContentProvider(ISSUE_LOG_URI_SCHEME, new IssueService());
  const translator = new IssueToListTranslator(issueContentProvider);
  const listDataProvider = new ListDataProvider(translator.toList(issueListFixture1));

  window.createTreeView('testView', {
    treeDataProvider: listDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(ISSUE_LOG_URI_SCHEME, issueContentProvider),

    commands.registerCommand('testView.refreshEntry', () =>
      listDataProvider.refresh(translator.toList(issueListFixture2)),
    ),

    commands.registerCommand('testView.resolveIssue', (issueItemOrUnknown: unknown) => {
      if (!(issueItemOrUnknown instanceof IssueItem)) {
        console.error('Got not issue item for testView.resolveIssue');
        return;
      }
      listDataProvider.refresh(translator.toList(issueListFixture2));
    }),
  );
};
