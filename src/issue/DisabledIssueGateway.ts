import { Result } from '../utils';
import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';
import { IIssueGateway, IssueGatewayErrorResult } from './IssueGateway';
import { IssueList } from './IssueList';

export class DisabledIssueGateway implements IIssueGateway {
  get isInReadyState() {
    return true;
  }

  getIssueById(): Promise<Result<Issue, IssueGatewayErrorResult>> {
    return Promise.resolve({
      isSuccess: true,
      data: {
        id: '1',
        link: '',
        errorMessage:
          'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
        title:
          'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
        date: new Date(),
        amount: 15,
      },
    });
  }

  async getIssueList(): Promise<Result<IssueList, IssueGatewayErrorResult>> {
    return Promise.resolve({
      isSuccess: true,
      data: [
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
      ],
    });
  }

  resolveIssue(): Promise<Result<true, IssueGatewayErrorResult>> {
    return Promise.resolve({ isSuccess: true, data: true });
  }

  ignoreIssue(): Promise<Result<true, IssueGatewayErrorResult>> {
    return Promise.resolve({ isSuccess: true, data: true });
  }

  getIssueDetails(): Promise<Result<IssueDetails, IssueGatewayErrorResult>> {
    return Promise.resolve({ isSuccess: true, data: { rawText: '', tags: [] } });
  }
}
