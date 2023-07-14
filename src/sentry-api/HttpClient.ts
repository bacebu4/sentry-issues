import { fetch } from 'undici';

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
  }): Promise<unknown> {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method,
      headers: { ...(headers || {}), ['Content-Type']: 'application/json' },
    });
    return response.json();
  }
}
