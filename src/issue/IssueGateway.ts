import { Result } from '../shared';
import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';
import { IssueList } from './IssueList';

export interface IIssueGateway {
  getIssueList(): Promise<Result<IssueList, number>>;
  getIssueById(issueId: string): Promise<Result<Issue, number>>;
  resolveIssue(issueId: string): Promise<Result<true, number>>;
  ignoreIssue(issueId: string): Promise<Result<true, number>>;
  getIssueDetails(issueId: string): Promise<Result<IssueDetails, number>>;
}
