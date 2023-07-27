import { HumanDate } from '../shared/HumanDate';
import { Result } from '../utils';
import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';
import { IIssueGateway, IssueGatewayErrorResult } from './IssueGateway';
import { IssueList } from './IssueList';

export class DisabledIssueGateway implements IIssueGateway {
  public get isInReadyState(): boolean {
    return true;
  }

  public getIssueById(): Promise<Result<Issue, IssueGatewayErrorResult>> {
    return Promise.resolve({
      isSuccess: true,
      data: {
        id: '1',
        link: '',
        errorMessage:
          'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
        title:
          'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
        date: new HumanDate(new Date()),
        firstSeenDate: new HumanDate(new Date()),
        amount: 15,
      },
    });
  }

  public async getIssueList(): Promise<Result<IssueList, IssueGatewayErrorResult>> {
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
              date: new HumanDate(new Date()),
              firstSeenDate: new HumanDate(new Date()),
              amount: 15,
            },
            {
              id: '2',
              link: '',
              errorMessage:
                'Error: Error occurred during call to route: /private/api/v1/credit-registry/parse-credit-registry',
              title:
                'Error: Error occurred during call to route: /private/api/v1/credit-registry/parse-credit-registry',
              date: new HumanDate(new Date()),
              firstSeenDate: new HumanDate(new Date()),
              amount: 15,
            },
          ],
        },
      ],
    });
  }

  public resolveIssue(): Promise<Result<true, IssueGatewayErrorResult>> {
    return Promise.resolve({ isSuccess: true, data: true });
  }

  public ignoreIssue(): Promise<Result<true, IssueGatewayErrorResult>> {
    return Promise.resolve({ isSuccess: true, data: true });
  }

  public getIssueDetails(): Promise<Result<IssueDetails, IssueGatewayErrorResult>> {
    return Promise.resolve({ isSuccess: true, data: { rawText: '', tags: [] } });
  }
}
