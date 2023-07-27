import { Issue as SentryIssue } from '../sentry-api';
import { HumanDate } from '../shared/HumanDate';
import { Issue } from './Issue';

export class SentryIssueTranslator {
  public static toIssue(i: SentryIssue): Issue {
    return {
      id: i.id,
      title: i.title,
      link: i.permalink,
      date: new HumanDate(new Date(i.lastSeen)),
      firstSeenDate: new HumanDate(new Date(i.firstSeen)),
      errorMessage: 'value' in i.metadata ? i.metadata.value : i.metadata.title,
      amount: Number(i.count),
    };
  }
}
