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

    return issuesScheme.parse(response);
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

  private get headers() {
    return {
      authorization: `Bearer ${this.options.token}`,
    };
  }
}
