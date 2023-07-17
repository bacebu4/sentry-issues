import { URL } from 'url';

export class UrlBuilder {
  private paths: string[] = [];
  private searchParams: Record<string, string> = {};
  private shouldUseTrailingSlash: boolean | undefined = undefined;

  constructor(private readonly base: string) {}

  private get fullPath() {
    const baseWithPath = this.paths.reduce((acc, el) => {
      if (acc.endsWith('/') && el.startsWith('/')) {
        acc += el.slice(1);
      } else if (!acc.endsWith('/') && !el.startsWith('/')) {
        acc += '/' + el;
      } else {
        acc += el;
      }
      return acc;
    }, this.base);

    if (this.shouldUseTrailingSlash === true) {
      return this.addTrailingSlash(baseWithPath);
    }

    if (this.shouldUseTrailingSlash === false) {
      return this.removeTrailingSlash(baseWithPath);
    }

    return baseWithPath;
  }

  public toString() {
    const url = new URL(this.fullPath);

    for (const [key, value] of Object.entries(this.searchParams)) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  }

  public addPath(path: string | string[]) {
    if (Array.isArray(path)) {
      this.paths.push(...path);
      return this;
    }
    this.paths.push(path);
    return this;
  }

  public addSearchParam(searchParams: Record<string, string>) {
    this.searchParams = { ...this.searchParams, ...searchParams };
    return this;
  }

  public useTrailingSlash(use: boolean) {
    this.shouldUseTrailingSlash = use;
  }

  private addTrailingSlash(s: string) {
    if (s.endsWith('/')) {
      return s;
    }

    return s + '/';
  }

  private removeTrailingSlash(s: string) {
    if (!s.endsWith('/')) {
      return s;
    }

    return s.substring(0, s.length - 1);
  }
}
