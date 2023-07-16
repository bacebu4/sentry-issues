export class Credentials {
  constructor(private props: { instanceUrl: string; token: string }) {}

  get instanceUrl() {
    return this.props.instanceUrl;
  }

  get token() {
    return this.props.token;
  }
}
