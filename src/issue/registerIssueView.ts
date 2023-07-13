import { ExtensionContext, commands, window, workspace } from 'vscode';
import { SentryApi } from '../sentry-api';
import { ListDataProvider } from '../shared';
import { IssueContentProvider } from './IssueContentProvider';
import { IssueItem } from './IssueItem';
import { IssueService } from './IssueService';
import { IssueToListTranslator } from './IssueToListTranslator';

export const registerIssueView = async (context: ExtensionContext, sentryApi: SentryApi) => {
  const ISSUE_LOG_URI_SCHEME = 'sentry-issue-log';

  const issueService = new IssueService(sentryApi);
  const issueContentProvider = new IssueContentProvider(ISSUE_LOG_URI_SCHEME, issueService);

  const issueList = await issueService.getIssueList();
  const translator = new IssueToListTranslator(issueContentProvider);
  const listDataProvider = new ListDataProvider(translator.toList(issueList));

  window.createTreeView('testView', {
    treeDataProvider: listDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(ISSUE_LOG_URI_SCHEME, issueContentProvider),

    commands.registerCommand('testView.refreshEntry', async () => {
      const issueList = await issueService.getIssueList();
      listDataProvider.refresh(translator.toList(issueList));
    }),

    commands.registerCommand('testView.resolveIssue', (issueItemOrUnknown: unknown) => {
      if (!(issueItemOrUnknown instanceof IssueItem)) {
        console.error('Got not issue item for testView.resolveIssue');
        return;
      }
    }),
  );
};
