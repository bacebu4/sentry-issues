import { SentryApi } from '../sentry-api';
import { Issue, IssueList } from './Issue';

export class IssueService {
  constructor(private readonly api: SentryApi) {}

  getById(issueId: string): Promise<unknown> {
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
}
