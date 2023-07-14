import { HttpJsonClient } from './HttpClient';
import { Issue, Project, issuesScheme, projectsScheme } from './types';

export class SentryApi {
  private client: HttpJsonClient;

  constructor(private readonly options: { host: string; token: string }) {
    this.client = new HttpJsonClient();
  }

  async getProjects(): Promise<Project[]> {
    const response = await this.client.request({
      method: 'GET',
      url: this.getProjectsUrl(),
      headers: this.headers,
    });

    return projectsScheme.parse(response);
  }

  async getUnresolvedIssuesForProject(project: Project): Promise<Issue[]> {
    const response = await this.client.request({
      method: 'GET',
      url: this.getUnresolvedIssuedUrl(project),
      headers: this.headers,
    });

    console.log(response);

    return issuesScheme.parse(response);
  }

  async getIssueById(issueId: string) {
    return this.client.request({
      method: 'GET',
      url: this.getIssueUrl(issueId),
      headers: this.headers,
    });
  }

  async updateIssue({ issueId, status }: { issueId: string; status: 'resolved' | 'ignored' }) {
    await this.client.request({
      method: 'PUT',
      url: this.getUpdateIssueUrl(issueId),
      body: { status },
      headers: this.headers,
    });
  }

  private getProjectsUrl() {
    return this.options.host + `api/0/projects/`;
  }

  private getUnresolvedIssuedUrl(project: Project) {
    return (
      this.options.host +
      `api/0/projects/${project.organization.slug}/${project.slug}/issues/?query=is:unresolved`
    );
  }

  private getIssueUrl(issueId: string) {
    return this.options.host + `api/0/issues/${issueId}/`;
  }

  private getUpdateIssueUrl(issueId: string) {
    return this.options.host + `api/0/issues/${issueId}/`;
  }

  private get headers() {
    return {
      ['Authorization']: `Bearer ${this.options.token}`,
    };
  }
}
