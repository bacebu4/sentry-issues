import { z } from 'zod';
import {
  HTTP_JSON_CLIENT_ERROR_CODES,
  HttpJsonClient,
  HttpJsonClientErrorCodeValue,
} from '../http-json-client';
import { Issue, Project, eventScheme, issueScheme, projectsScheme, Event } from './types';
import { jsonToText } from './jsonToText';
import { IJsonParser, JsonValue, VoidParser, ZodParser } from '../json-parser';
import { Result, UrlBuilder, exhaustiveMatchingGuard } from '../utils';
import { Logger } from '../logger/Logger';

export const SENTRY_API_ERROR_CODES = {
  schemeValidationFailed: 1,
  optionsWereNotProvided: 2,
  authenticationError: 3,
  jsonParseError: 4,
  networkError: 5,
  unknownApiError: 6,
} as const;

export type SentryApiErrorCodeValue =
  (typeof SENTRY_API_ERROR_CODES)[keyof typeof SENTRY_API_ERROR_CODES];

export class SentryApi {
  private client: HttpJsonClient;
  private options: { host: string; token: string };

  public get hasProvidedOptions(): boolean {
    return this.options.host !== '' && this.options.token !== '';
  }

  private get headers(): Record<string, string> {
    return {
      ['Authorization']: `Bearer ${this.options.token}`,
    };
  }

  public constructor(private readonly logger: Logger) {
    this.client = new HttpJsonClient();
    this.options = { host: '', token: '' };
  }

  public setOptions(options: { host: string; token: string }): void {
    this.options = options;
  }

  public async getProjects(): Promise<Result<Project[], SentryApiErrorCodeValue>> {
    const response = await this.request({
      params: {
        method: 'GET',
        url: this.getProjectsUrl(),
      },
      parser: new ZodParser(projectsScheme),
    });

    if (!response.isSuccess) {
      return response;
    }

    return { isSuccess: true, data: response.data.parsed };
  }

  public async getUnresolvedIssuesForProject(
    project: Project,
  ): Promise<Result<Issue[], SentryApiErrorCodeValue>> {
    const response = await this.request({
      params: {
        method: 'GET',
        url: this.getUnresolvedIssuesUrl(project),
      },
      parser: new ZodParser(z.array(issueScheme)),
    });

    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: true,
      data: await Promise.all(
        response.data.parsed.map(async issue => ({
          ...issue,
          permalink: await this.getPermalink({ issue, project }),
        })),
      ),
    };
  }

  public async getIssueById(issueId: string): Promise<Result<Issue, SentryApiErrorCodeValue>> {
    const response = await this.request({
      params: {
        method: 'GET',
        url: this.getIssueUrl(issueId),
      },
      parser: new ZodParser(issueScheme),
    });

    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: true,
      data: {
        ...response.data.parsed,
        permalink: await this.getPermalink({ issue: response.data.parsed, project: undefined }),
      },
    };
  }

  public async updateIssue({
    issueId,
    status,
  }: {
    issueId: string;
    status: 'resolved' | 'ignored';
  }): Promise<Result<true, SentryApiErrorCodeValue>> {
    const response = await this.request({
      params: {
        method: 'PUT',
        url: this.getUpdateIssueUrl(issueId),
        body: { status },
      },
      parser: new VoidParser(),
    });

    if (!response.isSuccess) {
      return response;
    }

    return { isSuccess: true, data: true };
  }

  public async getLatestEventForIssue(
    issueId: string,
  ): Promise<Result<Event, SentryApiErrorCodeValue>> {
    const response = await this.request({
      params: {
        method: 'GET',
        url: this.getLatestEventForIssueUrl(issueId),
      },
      parser: new ZodParser(eventScheme),
    });

    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: true,
      data: {
        tags: response.data.parsed.tags,
        raw: jsonToText(response.data.raw),
      },
    };
  }

  private async request<T extends JsonValue>({
    params,
    parser,
  }: {
    params: Omit<Parameters<HttpJsonClient['request']>[0], 'headers'>;
    parser: IJsonParser<T>;
  }): Promise<Result<{ parsed: T; raw: unknown }, SentryApiErrorCodeValue>> {
    if (!this.hasProvidedOptions) {
      this.logger.warn('Request was tried to be mad without provided options');

      return { isSuccess: false, error: SENTRY_API_ERROR_CODES.optionsWereNotProvided };
    }

    const response = await this.client.request({ ...params, headers: this.headers });

    if (!response.isSuccess) {
      this.logger.error('Error occurred during API call', {
        params,
        mappedError: this.mapError(response.error),
        response,
      });

      return { isSuccess: false, error: this.mapError(response.error) };
    }

    const parseResult = parser.execute(response.data);

    if (parseResult.isSuccess) {
      return { isSuccess: true, data: { parsed: parseResult.data, raw: response.data } };
    }

    this.logger.error('Error occurred during parsing response', {
      parsingErrorMessage: parseResult.error.message,
      params,
      responseData: response.data,
    });

    return { isSuccess: false, error: SENTRY_API_ERROR_CODES.schemeValidationFailed };
  }

  private getProjectsUrl(): string {
    return this.createUrlBuilder().addPath(['api/0/projects']).toString();
  }

  private getUnresolvedIssuesUrl(project: Project): string {
    return this.createUrlBuilder()
      .addPath(`api/0/projects/${project.organization.slug}/${project.slug}/issues/`)
      .addSearchParam({ query: 'is:unresolved' })
      .toString();
  }

  private getIssueUrl(issueId: string): string {
    return this.createUrlBuilder().addPath(`api/0/issues/${issueId}/`).toString();
  }

  private getUpdateIssueUrl(issueId: string): string {
    return this.createUrlBuilder().addPath(`api/0/issues/${issueId}/`).toString();
  }

  private getLatestEventForIssueUrl(issueId: string): string {
    return this.createUrlBuilder().addPath(`api/0/issues/${issueId}/events/latest/`).toString();
  }

  private async getPermalink({
    issue,
    project,
  }: {
    issue: Issue;
    project: Project | undefined;
  }): Promise<string> {
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

    return this.createUrlBuilder()
      .addPath(`${requestedProject.organization.slug}/issues/${issue.id}`)
      .toString();
  }

  private createUrlBuilder(): UrlBuilder {
    return new UrlBuilder(this.options.host).useTrailingSlash(true);
  }

  private mapError({
    errorCode,
    statusCode,
  }: {
    errorCode: HttpJsonClientErrorCodeValue;
    statusCode: number | undefined;
  }): SentryApiErrorCodeValue {
    if (errorCode === HTTP_JSON_CLIENT_ERROR_CODES.apiError && statusCode === 403) {
      return SENTRY_API_ERROR_CODES.authenticationError;
    }

    switch (errorCode) {
      case HTTP_JSON_CLIENT_ERROR_CODES.apiError:
        return SENTRY_API_ERROR_CODES.unknownApiError;

      case HTTP_JSON_CLIENT_ERROR_CODES.jsonParseError:
        return SENTRY_API_ERROR_CODES.jsonParseError;

      case HTTP_JSON_CLIENT_ERROR_CODES.networkError:
        return SENTRY_API_ERROR_CODES.networkError;

      default:
        return exhaustiveMatchingGuard(errorCode);
    }
  }
}
