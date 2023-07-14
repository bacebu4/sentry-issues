import { z } from 'zod';
import { HttpJsonClient } from './HttpClient';
import { Issue, Project, issueScheme, projectsScheme } from './types';

export class SentryApi {
  private client: HttpJsonClient;

  constructor(private readonly options: { host: string; token: string }) {
    this.client = new HttpJsonClient();
  }

  async getProjects(): Promise<Project[]> {
    const response = await this.request({
      method: 'GET',
      url: this.getProjectsUrl(),
    });

    return projectsScheme.parse(response);
  }

  async getUnresolvedIssuesForProject(project: Project): Promise<Issue[]> {
    const response = await this.request({
      method: 'GET',
      url: this.getUnresolvedIssuedUrl(project),
    });

    console.log(response);

    return Promise.all(
      z
        .array(issueScheme)
        .parse(response)
        .map(async issue => ({
          ...issue,
          permalink: await this.getPermalink({ issue, project }),
        })),
    );
  }

  async getIssueById(issueId: string): Promise<Issue> {
    const response = await this.request({
      method: 'GET',
      url: this.getIssueUrl(issueId),
    });

    const result = issueScheme.parse(response);

    return { ...result, permalink: await this.getPermalink({ issue: result, project: undefined }) };
  }

  async updateIssue({ issueId, status }: { issueId: string; status: 'resolved' | 'ignored' }) {
    await this.request({
      method: 'PUT',
      url: this.getUpdateIssueUrl(issueId),
      body: { status },
    });
  }

  async getLatestEventForIssue(issueId: string) {
    return this.request({
      method: 'GET',
      url: this.getLatestEventForIssueUrl(issueId),
    });
  }

  private request(params: Omit<Parameters<HttpJsonClient['request']>[0], 'headers'>) {
    return this.client.request({ ...params, headers: this.headers });
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

  private getLatestEventForIssueUrl(issueId: string) {
    return this.options.host + `api/0/issues/${issueId}/events/latest/`;
  }

  private async getPermalink({ issue, project }: { issue: Issue; project: Project | undefined }) {
    // Permalink it not implemented in GlitchTip API
    const shouldUseFallback = issue.permalink === 'Not implemented';

    if (!shouldUseFallback) {
      return issue.permalink;
    }

    const allProjects = project ? [project] : await this.getProjects();
    const requestedProject = allProjects.find(p => p.id === issue.project.id);

    if (!requestedProject) {
      return issue.permalink;
    }

    return this.options.host + `${requestedProject.organization.slug}/issues/${issue.id}`;
  }

  private get headers() {
    return {
      ['Authorization']: `Bearer ${this.options.token}`,
    };
  }
}
