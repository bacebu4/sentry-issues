import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';
import { IssueList } from './IssueList';

export interface IIssueGateway {
  getIssueList(): Promise<IssueList>;
  getIssueById(issueId: string): Promise<Issue>;
  resolveIssue(issueId: string): Promise<void>;
  ignoreIssue(issueId: string): Promise<void>;
  getIssueDetails(issueId: string): Promise<IssueDetails>;
}
