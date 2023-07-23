export class Credentials {
  constructor(private props: { instanceUrl: string; token: string }) {}

  get instanceUrl(): string {
    return this.props.instanceUrl;
  }

  get token(): string {
    return this.props.token;
  }
}
