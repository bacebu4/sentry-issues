import { ExtensionContext, commands, workspace } from 'vscode';
import { Logger } from '../logger';
import { SentryApi } from '../sentry-api';
import { ListDataProvider, createTreeView } from '../shared';
import { IgnoreIssueService } from './IgnoreIssueService';
import { IssueContentProvider } from './IssueContentProvider';
import { IIssueGateway } from './IssueGateway';
import { IssueToListTranslator } from './IssueToListTranslator';
import { OpenIssueInBrowserService } from './OpenIssueInBrowserService';
import { RefreshIssuesService } from './RefreshIssuesService';
import { ResolveIssueService } from './ResolveIssueService';
import { SentryIssueGateway } from './SentryIssueGateway';
import { ISSUE_COMMANDS, ISSUE_VIEW_ID } from './constants';
import { CopyIssueLinkService } from './CopyIssueLinkService';

export const registerIssueView = async (
  context: ExtensionContext,
  sentryApi: SentryApi,
  createLogger: (context: string) => Logger,
  showErrorMessage: (message: string) => void,
): Promise<void> => {
  const ISSUE_CONTENT_URI_SCHEME = 'sentry-issue-log';

  const gateway: IIssueGateway = new SentryIssueGateway(sentryApi);
  const issueContentProvider = new IssueContentProvider(ISSUE_CONTENT_URI_SCHEME, gateway);

  const translator = new IssueToListTranslator(issueContentProvider);
  const refreshIssuesService = new RefreshIssuesService(
    gateway,
    createLogger('RefreshIssuesService'),
    showErrorMessage,
  );

  const listDataProvider = new ListDataProvider(
    createLogger('IssueListDataProvider'),
    () => refreshIssuesService.execute().then(i => translator.toList(i)),
    ISSUE_VIEW_ID,
  );

  createTreeView(listDataProvider, ISSUE_VIEW_ID);

  const resolveIssueService = new ResolveIssueService(
    gateway,
    createLogger('ResolveIssueService'),
    showErrorMessage,
  );
  const ignoreIssueService = new IgnoreIssueService(
    gateway,
    createLogger('IgnoreIssueService'),
    showErrorMessage,
  );
  const openIssueInBrowser = new OpenIssueInBrowserService(
    createLogger('OpenIssueInBrowserService'),
  );
  const copyIssueLink = new CopyIssueLinkService(createLogger('CopyIssueLinkService'));

  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(ISSUE_CONTENT_URI_SCHEME, issueContentProvider),
    commands.registerCommand(ISSUE_COMMANDS.refreshIssues, () => listDataProvider.refresh()),
    commands.registerCommand(ISSUE_COMMANDS.resolveIssue, i => resolveIssueService.execute(i)),
    commands.registerCommand(ISSUE_COMMANDS.ignoreIssue, i => ignoreIssueService.execute(i)),
    commands.registerCommand(ISSUE_COMMANDS.openIssueInBrowser, i => openIssueInBrowser.execute(i)),
    commands.registerCommand(ISSUE_COMMANDS.copyIssueLink, i => copyIssueLink.execute(i)),
  );
};
