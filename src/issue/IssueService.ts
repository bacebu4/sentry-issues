import { Issue } from './Issue';

export class IssueService {
  getById(issueId: string): Promise<Issue> {
    return Promise.resolve({
      id: 'string',
      date: new Date(),
      errorMessage: 'string',
      labels: ['label 1: 100%', 'label 2: 100%'],
      amount: 13,
    });
  }
}
