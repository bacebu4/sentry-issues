import { Result } from '../shared';
import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';
import { IssueList } from './IssueList';

export type IssueGatewayErrorResult = { message: string };

export interface IIssueGateway {
  getIssueList(): Promise<Result<IssueList, IssueGatewayErrorResult>>;
  getIssueById(issueId: string): Promise<Result<Issue, IssueGatewayErrorResult>>;
  resolveIssue(issueId: string): Promise<Result<true, IssueGatewayErrorResult>>;
  ignoreIssue(issueId: string): Promise<Result<true, IssueGatewayErrorResult>>;
  getIssueDetails(issueId: string): Promise<Result<IssueDetails, IssueGatewayErrorResult>>;
}
