import { fetch } from 'undici';
import { Result } from '../shared';

const HTTP_JSON_CLIENT_ERROR_CODES = {
  networkError: 1,
  jsonParseError: 2,
  apiError: 3,
};

export class HttpJsonClient {
  async request({
    method,
    body,
    url,
    headers,
  }: {
    method: 'GET' | 'POST' | 'PUT';
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    url: string;
  }): Promise<Result<unknown, { errorCode: number; cause: unknown }>> {
    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        method,
        headers: { ...(headers || {}), ['Content-Type']: 'application/json' },
      });

      if (!response.ok) {
        return {
          isSuccess: false,
          error: { errorCode: HTTP_JSON_CLIENT_ERROR_CODES.apiError, cause: response.status },
        };
      }

      try {
        const data = await response.json();
        return { isSuccess: true, data };
      } catch (e) {
        return {
          isSuccess: false,
          error: { errorCode: HTTP_JSON_CLIENT_ERROR_CODES.jsonParseError, cause: e },
        };
      }
    } catch (e) {
      return {
        isSuccess: false,
        error: { errorCode: HTTP_JSON_CLIENT_ERROR_CODES.networkError, cause: e },
      };
    }
  }
}
