import { SentryApi } from '../sentry-api';
import { Issue, IssueList } from './Issue';

export class IssueService {
  constructor(private readonly api: SentryApi) {}

  getById(issueId: string): Promise<Issue> {
    return Promise.resolve({
      id: 'string',
      date: new Date(),
      errorMessage: 'string',
      labels: ['label 1: 100%', 'label 2: 100%'],
      amount: 13,
    });
  }

  async getIssueList(): Promise<IssueList> {
    const project = await this.api.getProjects();
    const projectWithIssues = await Promise.all(
      project.map(async p => {
        const issues = await this.api.getUnresolvedIssuesForProject(p);
        return { project: p, issues };
      }),
    );

    return projectWithIssues.map(p => ({
      label: p.project.name,
      children: p.issues.map(i => ({
        id: i.id,
        date: new Date(i.lastSeen),
        errorMessage: i.title,
        amount: Number(i.count),
      })),
    }));
  }
}
