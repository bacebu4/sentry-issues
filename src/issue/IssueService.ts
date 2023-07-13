import { SentryApi } from '../sentry-api';
import { Issue, IssueList } from './Issue';

export class IssueService {
  constructor(private readonly api: SentryApi) {}

  getById(issueId: string): Promise<Issue> {
    return Promise.resolve({
      id: 'string',
      date: new Date(),
      errorMessage: 'string',
      title: 'string',
      amount: 13,
    });
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
      label: p.project.name,
      children: p.issues.map(i => ({
        id: i.id,
        title: i.title,
        date: new Date(i.lastSeen),
        errorMessage: 'value' in i.metadata ? i.metadata.value : i.metadata.title,
        amount: Number(i.count),
      })),
    }));
  }
}
