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
import { COMMANDS, ISSUE_VIEW_ID } from './constants';

export const registerIssueView = async (
  context: ExtensionContext,
  sentryApi: SentryApi,
  loggerOutputPort: (t: string) => void,
) => {
  const ISSUE_CONTENT_URI_SCHEME = 'sentry-issue-log';

  const gateway: IIssueGateway = new SentryIssueGateway(sentryApi);
  const issueContentProvider = new IssueContentProvider(ISSUE_CONTENT_URI_SCHEME, gateway);
  const translator = new IssueToListTranslator(issueContentProvider);
  const listDataProvider = new ListDataProvider(
    [],
    new Logger('IssueListDataProvider', loggerOutputPort),
  );

  window.createTreeView(ISSUE_VIEW_ID, {
    treeDataProvider: listDataProvider,
    showCollapseAll: true,
  });

  const refreshIssuesService = new RefreshIssuesService(gateway, list =>
    listDataProvider.refresh(translator.toList(list)),
  );
  const resolveIssueService = new ResolveIssueService(
    gateway,
    new Logger('ResolveIssueService', loggerOutputPort),
  );
  const ignoreIssueService = new IgnoreIssueService(
    gateway,
    new Logger('IgnoreIssueService', loggerOutputPort),
  );
  const openIssueInBrowser = new OpenIssueInBrowserService(
    new Logger('OpenIssueInBrowserService', loggerOutputPort),
  );

  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(ISSUE_CONTENT_URI_SCHEME, issueContentProvider),
    commands.registerCommand(COMMANDS.refreshIssues, () => refreshIssuesService.execute()),
    commands.registerCommand(COMMANDS.resolveIssue, (i: unknown) => resolveIssueService.execute(i)),
    commands.registerCommand(COMMANDS.ignoreIssue, (i: unknown) => ignoreIssueService.execute(i)),
    commands.registerCommand(COMMANDS.openIssueInBrowser, (i: unknown) =>
      openIssueInBrowser.execute(i),
    ),
  );

  await commands.executeCommand(COMMANDS.refreshIssues);
};
