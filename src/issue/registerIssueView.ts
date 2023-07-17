import { ExtensionContext, Uri, commands, window, workspace } from 'vscode';
import { SentryApi } from '../sentry-api';
import { ListDataProvider, VS_COMMANDS } from '../shared';
import { IssueContentProvider } from './IssueContentProvider';
import { IIssueGateway } from './IssueGateway';
import { IssueItem } from './IssueItem';
import { IssueToListTranslator } from './IssueToListTranslator';
import { SentryIssueGateway } from './SentryIssueGateway';
import { COMMANDS, ISSUE_VIEW_ID } from './constants';
import { Logger } from '../logger';
import { RefreshIssuesService } from './RefreshIssuesService';
import { ResolveIssueService } from './ResolveIssueService';
import { IgnoreIssueService } from './IgnoreIssueService';

export const registerIssueView = async (context: ExtensionContext, sentryApi: SentryApi) => {
  const ISSUE_CONTENT_URI_SCHEME = 'sentry-issue-log';

  const gateway: IIssueGateway = new SentryIssueGateway(sentryApi);

  const issueContentProvider = new IssueContentProvider(ISSUE_CONTENT_URI_SCHEME, gateway);

  const translator = new IssueToListTranslator(issueContentProvider);
  const listDataProvider = new ListDataProvider([], new Logger('IssueListDataProvider'));

  window.createTreeView(ISSUE_VIEW_ID, {
    treeDataProvider: listDataProvider,
    showCollapseAll: true,
  });

  const refreshIssuesService = new RefreshIssuesService(gateway, list =>
    listDataProvider.refresh(translator.toList(list)),
  );
  const resolveIssueService = new ResolveIssueService(gateway, new Logger('ResolveIssueService'));
  const ignoreIssueService = new IgnoreIssueService(gateway, new Logger('IgnoreIssueService'));

  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(ISSUE_CONTENT_URI_SCHEME, issueContentProvider),
    commands.registerCommand(COMMANDS.refreshIssues, () => refreshIssuesService.execute()),
    commands.registerCommand(COMMANDS.resolveIssue, (i: unknown) => resolveIssueService.execute(i)),
    commands.registerCommand(COMMANDS.ignoreIssue, (i: unknown) => ignoreIssueService.execute(i)),

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
