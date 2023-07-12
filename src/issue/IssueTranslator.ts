import { IssueContentProvider } from './IssueContentProvider';
import { IssueItem } from './IssueItem';
import { IssueList } from './Issue';
import { List } from '../shared';

export class IssueTranslator {
  constructor(private readonly issueContentProvider: IssueContentProvider) {}

  toList(raw: IssueList) {
    return raw.map(
      r =>
        new List({
          label: r.label,
          children: r.children.map(
            c =>
              new List({
                label: c.label,
                children: c.children.map(
                  i => new IssueItem(i, this.issueContentProvider.createOpenCommandForIssue(i)),
                ),
              }),
          ),
        }),
    );
  }
}
