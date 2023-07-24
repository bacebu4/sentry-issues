export class Credentials {
  public constructor(private props: { instanceUrl: string; token: string }) {}

  public get instanceUrl(): string {
    return this.props.instanceUrl;
  }

  public get token(): string {
    return this.props.token;
  }
}
