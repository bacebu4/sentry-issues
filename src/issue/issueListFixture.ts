import { IssueList } from './Issue';

export const issueListFixture1: IssueList = [
  {
    label: 'Backend',
    children: [
      {
        id: '1',
        errorMessage:
          'QueryFailedError: duplicate key value violates unique constraint "REL_e9e953986d0b2e385ce9724b94"',
        date: new Date(),
        amount: 15,
      },
      {
        id: '2',
        errorMessage:
          'Error: Error occurred during call to route: /private/api/v1/credit-registry/parse-credit-registry',
        date: new Date(),
        amount: 15,
      },
    ],
  },
];

export const issueListFixture2: IssueList = [
  {
    label: 'Backend',
    children: [
      {
        id: '3',
        errorMessage: 'PayloadTooLargeError: request entity too large',
        date: new Date(),
        amount: 15,
      },
      {
        id: '4',
        errorMessage:
          'QueryFailedError: insert or update on table "leasing_contracts" violates foreign key constraint "FK_60d98abda12bfedf66…',
        date: new Date(),
        amount: 15,
      },
    ],
  },
];
