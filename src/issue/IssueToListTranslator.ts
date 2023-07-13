import { IssueContentProvider } from './IssueContentProvider';
import { IssueItem } from './IssueItem';
import { IssueList } from './Issue';
import { List } from '../shared';

export class IssueToListTranslator {
  constructor(private readonly issueContentProvider: IssueContentProvider) {}

  toList(raw: IssueList) {
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
