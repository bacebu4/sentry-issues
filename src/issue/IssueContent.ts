import { BulletContent } from '../shared';
import { HumanDate } from '../shared/HumanDate';
import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';

export class IssueContent {
  public constructor(private readonly issue: Issue, private readonly issueDetails: IssueDetails) {}

  private get tagsContent(): string {
    const tags: [string, string][] = this.issueDetails.tags.values.map(({ key, values }) => [
      key,
      values
        .sort(({ percentage: a }, { percentage: b }) => (a > b ? -1 : 1))
        .map(({ value, percentage }) => `${value} (${percentage})`)
        .join(', '),
    ]);

    return new BulletContent('Tags', tags).toString();
  }

  private get metaInfoContent(): string {
    const metaInfo: [string, string][] = [
      this.dateToTuple(this.issue.date, 'Latest Date'),
      this.dateToTuple(this.issue.firstSeenDate, 'First Seen Date'),
      ['Times', this.issue.amount.toString()],
      ['Link', this.issue.link],
    ];

    return new BulletContent('Meta Info', metaInfo).toString();
  }

  public toString(): string {
    return [
      this.issue.title,
      this.issue.errorMessage,
      this.metaInfoContent,
      this.tagsContent,
      'Details',
      this.issueDetails.rawText,
    ].join('\n\n');
  }

  private dateToTuple(date: HumanDate, title: string): [string, string] {
    return [title, `${date.toString()} (${date.ago})`];
  }
}
