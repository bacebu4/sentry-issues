import { fetch } from 'undici';
import { Result } from '../utils';
import { Logger } from '../logger';

export const HTTP_JSON_CLIENT_ERROR_CODES = {
  networkError: 1,
  jsonParseError: 2,
  apiError: 3,
} as const;

export type HttpJsonClientErrorCodeValue =
  (typeof HTTP_JSON_CLIENT_ERROR_CODES)[keyof typeof HTTP_JSON_CLIENT_ERROR_CODES];

export class HttpJsonClient {
  public constructor(private readonly logger: Logger) {}

  public async request({
    method,
    body,
    url,
    headers,
  }: {
    method: 'GET' | 'POST' | 'PUT';
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    url: string;
  }): Promise<
    Result<
      unknown,
      {
        errorCode: HttpJsonClientErrorCodeValue;
        errorResponse: string | undefined;
        statusCode: number | undefined;
      }
    >
  > {
    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        method,
        headers: { ...(headers || {}), ['Content-Type']: 'application/json' },
      });

      if (!response.ok) {
        const errorResponse = await response.text().catch(error => {
          this.logger.error('Could not convert error response to text', { error });
          return undefined;
        });

        return {
          isSuccess: false,
          error: {
            errorCode: HTTP_JSON_CLIENT_ERROR_CODES.apiError,
            errorResponse,
            statusCode: response.status,
          },
        };
      }

      try {
        const data = await response.json();
        return { isSuccess: true, data };
      } catch (error) {
        this.logger.error('Could not convert successful response to json', { error });

        return {
          isSuccess: false,
          error: {
            errorCode: HTTP_JSON_CLIENT_ERROR_CODES.jsonParseError,
            statusCode: response.status,
            errorResponse: undefined,
          },
        };
      }
    } catch (error) {
      this.logger.error('Could not maker request', { error });

      return {
        isSuccess: false,
        error: {
          errorCode: HTTP_JSON_CLIENT_ERROR_CODES.networkError,
          statusCode: undefined,
          errorResponse: undefined,
        },
      };
    }
  }
}
