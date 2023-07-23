import { ExtensionContext, commands, window, workspace } from 'vscode';
import { Logger } from '../logger';
import { SentryApi } from '../sentry-api';
import { ListDataProvider } from '../shared';
import { IgnoreIssueService } from './IgnoreIssueService';
import { IssueContentProvider } from './IssueContentProvider';
import { IIssueGateway } from './IssueGateway';
import { IssueToListTranslator } from './IssueToListTranslator';
import { OpenIssueInBrowserService } from './OpenIssueInBrowserService';
import { RefreshIssuesService } from './RefreshIssuesService';
import { ResolveIssueService } from './ResolveIssueService';
import { SentryIssueGateway } from './SentryIssueGateway';
import { ISSUE_COMMANDS, ISSUE_VIEW_ID } from './constants';

export const registerIssueView = async (
  context: ExtensionContext,
  sentryApi: SentryApi,
  createLogger: (context: string) => Logger,
) => {
  const ISSUE_CONTENT_URI_SCHEME = 'sentry-issue-log';

  const gateway: IIssueGateway = new SentryIssueGateway(sentryApi);
  const issueContentProvider = new IssueContentProvider(ISSUE_CONTENT_URI_SCHEME, gateway);

  const translator = new IssueToListTranslator(issueContentProvider);
  const refreshIssuesService = new RefreshIssuesService(
    gateway,
    createLogger('RefreshIssuesService'),
  );

  const listDataProvider = new ListDataProvider(
    createLogger('IssueListDataProvider'),
    async () => refreshIssuesService.execute().then(i => translator.toList(i)),
    ISSUE_VIEW_ID,
  );

  window.createTreeView(ISSUE_VIEW_ID, {
    treeDataProvider: listDataProvider,
    showCollapseAll: true,
  });

  const resolveIssueService = new ResolveIssueService(gateway, createLogger('ResolveIssueService'));
  const ignoreIssueService = new IgnoreIssueService(gateway, createLogger('IgnoreIssueService'));
  const openIssueInBrowser = new OpenIssueInBrowserService(
    createLogger('OpenIssueInBrowserService'),
  );

  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(ISSUE_CONTENT_URI_SCHEME, issueContentProvider),
    commands.registerCommand(ISSUE_COMMANDS.refreshIssues, () => listDataProvider.refresh()),
    commands.registerCommand(ISSUE_COMMANDS.resolveIssue, (i: unknown) =>
      resolveIssueService.execute(i),
    ),
    commands.registerCommand(ISSUE_COMMANDS.ignoreIssue, (i: unknown) =>
      ignoreIssueService.execute(i),
    ),
    commands.registerCommand(ISSUE_COMMANDS.openIssueInBrowser, (i: unknown) =>
      openIssueInBrowser.execute(i),
    ),
  );
};
