import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';
import { IIssueGateway } from './IssueGateway';
import { IssueList } from './IssueList';

export class DisabledIssueGateway implements IIssueGateway {
  getIssueById(): Promise<Issue> {
    return Promise.resolve({
      id: '1',
      link: '',
      errorMessage:
        'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
      title:
        'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
      date: new Date(),
      amount: 15,
    });
  }

  async getIssueList(): Promise<IssueList> {
    return Promise.resolve([
      {
        projectName: 'Backend',
        issues: [
          {
            id: '1',
            link: '',
            errorMessage:
              'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
            title:
              'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
            date: new Date(),
            amount: 15,
          },
          {
            id: '2',
            link: '',
            errorMessage:
              'Error: Error occurred during call to route: /private/api/v1/credit-registry/parse-credit-registry',
            title:
              'Error: Error occurred during call to route: /private/api/v1/credit-registry/parse-credit-registry',
            date: new Date(),
            amount: 15,
          },
        ],
      },
    ]);
  }

  resolveIssue(): Promise<void> {
    return Promise.resolve();
  }

  ignoreIssue(): Promise<void> {
    return Promise.resolve();
  }

  getIssueDetails(): Promise<IssueDetails> {
    return Promise.resolve({ rawText: '', tags: [] });
  }
}
