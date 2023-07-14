import { SentryApi } from '../sentry-api';
import { IssueList } from './IssueList';
import { IIssueGateway } from './IssueGateway';

export class SentryIssueGateway implements IIssueGateway {
  constructor(private readonly api: SentryApi) {}

  getIssueById(issueId: string): Promise<unknown> {
    return this.api.getIssueById(issueId);
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
      issues: p.issues.map(i => ({
        id: i.id,
        title: i.title,
        date: new Date(i.lastSeen),
        errorMessage: 'value' in i.metadata ? i.metadata.value : i.metadata.title,
        amount: Number(i.count),
      })),
    }));
  }

  async resolveIssue(issueId: string): Promise<void> {
    await this.api.updateIssue({ issueId, status: 'resolved' });
  }

  async ignoreIssue(issueId: string): Promise<void> {
    await this.api.updateIssue({ issueId, status: 'ignored' });
  }
}
