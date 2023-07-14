import { ExtensionContext, Uri, commands, window, workspace } from 'vscode';
import { SentryApi } from '../sentry-api';
import { ListDataProvider, VS_COMMANDS } from '../shared';
import { IssueContentProvider } from './IssueContentProvider';
import { IssueItem } from './IssueItem';
import { IssueToListTranslator } from './IssueToListTranslator';
import { IIssueGateway } from './IssueGateway';
import { SentryIssueGateway } from './SentryIssueGateway';
import { COMMANDS, ISSUE_VIEW_ID } from './constants';

export const registerIssueView = async (context: ExtensionContext, sentryApi: SentryApi) => {
  const ISSUE_CONTENT_URI_SCHEME = 'sentry-issue-log';

  const issueGateway: IIssueGateway = new SentryIssueGateway(sentryApi);

  const issueContentProvider = new IssueContentProvider(ISSUE_CONTENT_URI_SCHEME, issueGateway);

  const translator = new IssueToListTranslator(issueContentProvider);
  const listDataProvider = new ListDataProvider([]);

  window.createTreeView(ISSUE_VIEW_ID, {
    treeDataProvider: listDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(ISSUE_CONTENT_URI_SCHEME, issueContentProvider),

    commands.registerCommand(COMMANDS.refreshIssues, async () => {
      const issueList = await issueGateway.getIssueList();
      listDataProvider.refresh(translator.toList(issueList));
    }),

    commands.registerCommand(COMMANDS.resolveIssue, async (issueItemOrUnknown: unknown) => {
      if (!(issueItemOrUnknown instanceof IssueItem)) {
        console.error(`Got not issue item for ${COMMANDS.resolveIssue}`);
        return;
      }
      await issueGateway.resolveIssue(issueItemOrUnknown.issue.id);
      await commands.executeCommand(COMMANDS.refreshIssues);
    }),

    commands.registerCommand(COMMANDS.ignoreIssue, async (issueItemOrUnknown: unknown) => {
      if (!(issueItemOrUnknown instanceof IssueItem)) {
        console.error(`Got not issue item for ${COMMANDS.ignoreIssue}`);
        return;
      }
      await issueGateway.ignoreIssue(issueItemOrUnknown.issue.id);
      await commands.executeCommand(COMMANDS.refreshIssues);
    }),

    commands.registerCommand(COMMANDS.openIssueInBrowser, async (issueItemOrUnknown: unknown) => {
      if (!(issueItemOrUnknown instanceof IssueItem)) {
        console.error(`Got not issue item for ${COMMANDS.openIssueInBrowser}`);
        return;
      }

      await commands.executeCommand(VS_COMMANDS.open, Uri.parse(issueItemOrUnknown.issue.link));
    }),
  );

  await commands.executeCommand(COMMANDS.refreshIssues);
};
