import { HttpJsonClient } from './HttpClient';

export class SentryApi {
  client: HttpJsonClient;

  constructor() {
    this.client = new HttpJsonClient();
  }
}
