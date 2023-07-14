import { SentryApi, Issue as SentryIssue } from '../sentry-api';
import { IssueList } from './IssueList';
import { IIssueGateway } from './IssueGateway';
import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';

export class SentryIssueGateway implements IIssueGateway {
  constructor(private readonly api: SentryApi) {}

  async getIssueById(issueId: string): Promise<Issue> {
    const result = await this.api.getIssueById(issueId);
    return this.mapIssue(result);
  }

  async getIssueList(): Promise<IssueList> {
    const allProjects = await this.api.getProjects();

    const projectWithIssues = await Promise.all(
      allProjects
        .filter(p => p.hasAccess)
        .map(async p => {
          const issues = await this.api.getUnresolvedIssuesForProject(p);
          return { project: p, issues };
        }),
    );

    return projectWithIssues.map(p => ({
      projectName: p.project.name,
      issues: p.issues.map(i => this.mapIssue(i)),
    }));
  }

  async resolveIssue(issueId: string): Promise<void> {
    await this.api.updateIssue({ issueId, status: 'resolved' });
  }

  async ignoreIssue(issueId: string): Promise<void> {
    await this.api.updateIssue({ issueId, status: 'ignored' });
  }

  async getIssueDetails(issueId: string): Promise<IssueDetails> {
    const result = await this.api.getLatestEventForIssue(issueId);

    return {
      rawText: result.raw,
      tags: result.tags,
    };
  }

  private mapIssue(i: SentryIssue): Issue {
    return {
      id: i.id,
      title: i.title,
      link: i.permalink,
      date: new Date(i.lastSeen),
      errorMessage: 'value' in i.metadata ? i.metadata.value : i.metadata.title,
      amount: Number(i.count),
    };
  }
}
