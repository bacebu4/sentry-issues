import { fetch } from 'undici';
import { Result } from '../utils';

export const HTTP_JSON_CLIENT_ERROR_CODES = {
  networkError: 1,
  jsonParseError: 2,
  apiError: 3,
} as const;

export type HttpJsonClientErrorCodeValue =
  (typeof HTTP_JSON_CLIENT_ERROR_CODES)[keyof typeof HTTP_JSON_CLIENT_ERROR_CODES];

export class HttpJsonClient {
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
      { errorCode: HttpJsonClientErrorCodeValue; cause: unknown; statusCode: number | undefined }
    >
  > {
    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        method,
        headers: { ...(headers || {}), ['Content-Type']: 'application/json' },
      });

      if (!response.ok) {
        return {
          isSuccess: false,
          error: {
            errorCode: HTTP_JSON_CLIENT_ERROR_CODES.apiError,
            cause: response.status,
            statusCode: response.status,
          },
        };
      }

      try {
        const data = await response.json();
        return { isSuccess: true, data };
      } catch (e) {
        return {
          isSuccess: false,
          error: {
            errorCode: HTTP_JSON_CLIENT_ERROR_CODES.jsonParseError,
            cause: e,
            statusCode: response.status,
          },
        };
      }
    } catch (e) {
      return {
        isSuccess: false,
        error: {
          errorCode: HTTP_JSON_CLIENT_ERROR_CODES.networkError,
          cause: e,
          statusCode: undefined,
        },
      };
    }
  }
}
