import { ExtensionContext, commands, window, workspace } from 'vscode';
import { SentryApi } from '../sentry-api';
import { ListDataProvider } from '../shared';
import { IssueContentProvider } from './IssueContentProvider';
import { IssueItem } from './IssueItem';
import { IssueToListTranslator } from './IssueToListTranslator';
import { IIssueGateway } from './IssueGateway';
import { SentryIssueGateway } from './SentryIssueGateway';

export const registerIssueView = async (context: ExtensionContext, sentryApi: SentryApi) => {
  const ISSUE_LOG_URI_SCHEME = 'sentry-issue-log';

  const issueGateway: IIssueGateway = new SentryIssueGateway(sentryApi);

  const issueContentProvider = new IssueContentProvider(ISSUE_LOG_URI_SCHEME, issueGateway);

  const translator = new IssueToListTranslator(issueContentProvider);
  const listDataProvider = new ListDataProvider([]);

  window.createTreeView('testView', {
    treeDataProvider: listDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(ISSUE_LOG_URI_SCHEME, issueContentProvider),

    commands.registerCommand('testView.refreshEntry', async () => {
      const issueList = await issueGateway.getIssueList();
      listDataProvider.refresh(translator.toList(issueList));
    }),

    commands.registerCommand('testView.resolveIssue', async (issueItemOrUnknown: unknown) => {
      if (!(issueItemOrUnknown instanceof IssueItem)) {
        console.error('Got not issue item for testView.resolveIssue');
        return;
      }
      await issueGateway.resolveIssue(issueItemOrUnknown.issue.id);
      await commands.executeCommand('testView.refreshEntry');
    }),

    commands.registerCommand('testView.ignoreIssue', async (issueItemOrUnknown: unknown) => {
      if (!(issueItemOrUnknown instanceof IssueItem)) {
        console.error('Got not issue item for testView.ignoreIssue');
        return;
      }
      await issueGateway.ignoreIssue(issueItemOrUnknown.issue.id);
      await commands.executeCommand('testView.refreshEntry');
    }),
  );

  await commands.executeCommand('testView.refreshEntry');
};
