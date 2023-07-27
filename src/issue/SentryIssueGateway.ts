import {
  SENTRY_API_ERROR_CODES,
  SentryApi,
  SentryApiErrorCodeValue,
  Issue as SentryIssue,
} from '../sentry-api';
import { IssueList } from './IssueList';
import { IIssueGateway, IssueGatewayErrorResult } from './IssueGateway';
import { Issue } from './Issue';
import { IssueDetails } from './IssueDetails';
import { Result, exhaustiveMatchingGuard, nonNullable } from '../utils';

export class SentryIssueGateway implements IIssueGateway {
  public constructor(private readonly api: SentryApi) {}

  public get isInReadyState(): boolean {
    return this.api.hasProvidedOptions;
  }

  public async getIssueById(issueId: string): Promise<Result<Issue, IssueGatewayErrorResult>> {
    const result = await this.api.getIssueById(issueId);

    if (result.isSuccess) {
      return { isSuccess: true, data: this.mapIssue(result.data) };
    }

    return { isSuccess: false, error: this.mapError(result.error) };
  }

  public async getIssueList(): Promise<Result<IssueList, IssueGatewayErrorResult>> {
    const allProjectsResult = await this.api.getProjects();

    if (!allProjectsResult.isSuccess) {
      return { isSuccess: false, error: this.mapError(allProjectsResult.error) };
    }

    const projectWithIssues = await Promise.all(
      allProjectsResult.data
        .filter(p => p.hasAccess)
        .map(async p => {
          const issuesResult = await this.api.getUnresolvedIssuesForProject(p);
          return { project: p, issuesResult };
        }),
    );

    const anyError = projectWithIssues
      .map(p => ('error' in p.issuesResult ? p.issuesResult.error : null))
      .filter(nonNullable)
      .at(0);

    if (anyError) {
      return { isSuccess: false, error: this.mapError(anyError) };
    }

    const data = projectWithIssues.map(p => ({
      projectName: p.project.name,
      issues: 'data' in p.issuesResult ? p.issuesResult.data.map(d => this.mapIssue(d)) : [],
    }));

    return { isSuccess: true, data };
  }

  public async resolveIssue(issueId: string): Promise<Result<true, IssueGatewayErrorResult>> {
    const result = await this.api.updateIssue({ issueId, status: 'resolved' });

    if (result.isSuccess) {
      return { isSuccess: true, data: true };
    }

    return { isSuccess: false, error: this.mapError(result.error) };
  }

  public async ignoreIssue(issueId: string): Promise<Result<true, IssueGatewayErrorResult>> {
    const result = await this.api.updateIssue({ issueId, status: 'ignored' });

    if (result.isSuccess) {
      return { isSuccess: true, data: true };
    }

    return { isSuccess: false, error: this.mapError(result.error) };
  }

  public async getIssueDetails(
    issueId: string,
  ): Promise<Result<IssueDetails, IssueGatewayErrorResult>> {
    const result = await this.api.getLatestEventForIssue(issueId);

    if (!result.isSuccess) {
      return { isSuccess: false, error: this.mapError(result.error) };
    }

    return {
      isSuccess: true,
      data: {
        rawText: result.data.raw,
        tags: result.data.tags,
      },
    };
  }

  private mapIssue(i: SentryIssue): Issue {
    return {
      id: i.id,
      title: i.title,
      link: i.permalink,
      date: new Date(i.lastSeen),
      firstSeenDate: new Date(i.firstSeen),
      errorMessage: 'value' in i.metadata ? i.metadata.value : i.metadata.title,
      amount: Number(i.count),
    };
  }

  private mapError(errorCode: SentryApiErrorCodeValue): IssueGatewayErrorResult {
    switch (errorCode) {
      case SENTRY_API_ERROR_CODES.optionsWereNotProvided:
        return { message: 'No credentials were provided.' };

      case SENTRY_API_ERROR_CODES.schemeValidationFailed:
        return { message: 'Unexpected format of response was received. Contact the developer.' };

      case SENTRY_API_ERROR_CODES.authenticationError:
        return { message: 'Authentication failed. Check your credentials.' };

      case SENTRY_API_ERROR_CODES.jsonParseError:
        return {
          message:
            'Unexpected error has occurred during parsing of JSON response. Contact the developer.',
        };

      case SENTRY_API_ERROR_CODES.networkError:
        return {
          message:
            'HTTP error has occurred. Check your internet connection of provided `instanceUrl` value',
        };

      case SENTRY_API_ERROR_CODES.unknownApiError:
        return { message: 'Unknown API error has occurred. Contact the developer.' };

      default:
        return exhaustiveMatchingGuard(errorCode);
    }
  }
}
