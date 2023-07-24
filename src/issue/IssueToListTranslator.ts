import { IssueContentProvider } from './IssueContentProvider';
import { IssueItem } from './IssueItem';
import { List } from '../shared';
import { IssueList } from './IssueList';

export class IssueToListTranslator {
  public constructor(private readonly issueContentProvider: IssueContentProvider) {}

  public toList(raw: IssueList): List[] {
    return raw.map(
      r =>
        new List({
          label: r.projectName,
          children: r.issues.map(
            i => new IssueItem(i, this.issueContentProvider.createOpenCommandForIssue(i)),
          ),
        }),
    );
  }
}
