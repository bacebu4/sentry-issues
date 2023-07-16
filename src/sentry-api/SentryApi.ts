import { z } from 'zod';
import { HttpJsonClient } from './HttpClient';
import { Issue, Project, eventScheme, issueScheme, projectsScheme, Event } from './types';
import { jsonToText } from './jsonToText';
import { Result } from '../shared';

const SENTRY_API_ERROR_CODES = {
  schemeValidationFailed: 1,
  requestError: 2,
};

export class SentryApi {
  private client: HttpJsonClient;
  private options: { host: string; token: string };

  constructor() {
    this.client = new HttpJsonClient();
    this.options = { host: '', token: '' };
  }

  setOptions(options: { host: string; token: string }) {
    this.options = options;
  }

  async getProjects(): Promise<Result<Project[], number>> {
    const response = await this.request({
      params: {
        method: 'GET',
        url: this.getProjectsUrl(),
      },
    });

    if (!response.isSuccess) {
      return response;
    }

    const parseResult = projectsScheme.safeParse(response.data);

    if (parseResult.success) {
      return { isSuccess: true, data: parseResult.data };
    }

    return { isSuccess: false, error: SENTRY_API_ERROR_CODES.schemeValidationFailed };
  }

  async getUnresolvedIssuesForProject(project: Project): Promise<Result<Issue[], number>> {
    const response = await this.request({
      params: {
        method: 'GET',
        url: this.getUnresolvedIssuedUrl(project),
      },
    });

    if (!response.isSuccess) {
      return response;
    }

    const parseResult = z.array(issueScheme).safeParse(response.data);

    if (!parseResult.success) {
      return { isSuccess: false, error: SENTRY_API_ERROR_CODES.schemeValidationFailed };
    }

    return {
      isSuccess: true,
      data: await Promise.all(
        parseResult.data.map(async issue => ({
          ...issue,
          permalink: await this.getPermalink({ issue, project }),
        })),
      ),
    };
  }

  async getIssueById(issueId: string): Promise<Result<Issue, number>> {
    const response = await this.request({
      params: {
        method: 'GET',
        url: this.getIssueUrl(issueId),
      },
    });

    if (!response.isSuccess) {
      return response;
    }

    const parseResult = issueScheme.safeParse(response.data);

    if (!parseResult.success) {
      return { isSuccess: false, error: SENTRY_API_ERROR_CODES.schemeValidationFailed };
    }

    return {
      isSuccess: true,
      data: {
        ...parseResult.data,
        permalink: await this.getPermalink({ issue: parseResult.data, project: undefined }),
      },
    };
  }

  async updateIssue({
    issueId,
    status,
  }: {
    issueId: string;
    status: 'resolved' | 'ignored';
  }): Promise<Result<true, number>> {
    const response = await this.request({
      params: {
        method: 'PUT',
        url: this.getUpdateIssueUrl(issueId),
        body: { status },
      },
    });

    if (response.isSuccess) {
      return { isSuccess: true, data: true };
    }

    return response;
  }

  async getLatestEventForIssue(issueId: string): Promise<Result<Event, number>> {
    const response = await this.request({
      params: {
        method: 'GET',
        url: this.getLatestEventForIssueUrl(issueId),
      },
    });

    if (!response.isSuccess) {
      return response;
    }

    const parseResult = eventScheme.safeParse(response.data);

    if (!parseResult.success) {
      return { isSuccess: false, error: SENTRY_API_ERROR_CODES.schemeValidationFailed };
    }

    return {
      isSuccess: true,
      data: {
        tags: parseResult.data.tags,
        raw: jsonToText(response),
      },
    };
  }

  private async request({
    params,
  }: {
    params: Omit<Parameters<HttpJsonClient['request']>[0], 'headers'>;
  }): Promise<Result<unknown, number>> {
    const response = await this.client.request({ ...params, headers: this.headers });

    if (response.isSuccess) {
      return { isSuccess: true, data: response.data };
    }

    return { isSuccess: false, error: SENTRY_API_ERROR_CODES.requestError };
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

    const allProjectsResult = project
      ? { isSuccess: true, data: [project] }
      : await this.getProjects();

    if (!allProjectsResult.isSuccess) {
      return 'Not implemented';
    }

    const requestedProject = allProjectsResult.data.find(p => p.id === issue.project.id);

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
