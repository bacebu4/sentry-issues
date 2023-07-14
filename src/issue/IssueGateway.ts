import { IssueList } from './IssueList';

export interface IIssueGateway {
  getIssueList(): Promise<IssueList>;
  getIssueById(issueId: string): Promise<unknown>;
  resolveIssue(issueId: string): Promise<void>;
}
