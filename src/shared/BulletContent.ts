export class BulletContent {
  public constructor(private readonly title: string, private readonly values: [string, string][]) {}

  private get longestKeyLength(): number {
    return this.values.map(([key]) => key.length).reduce((acc, val) => Math.max(acc, val));
  }

  public toString(): string {
    const bullets = this.values
      .map(([key, value]) => `- ${key.padEnd(this.longestKeyLength + 1)}: ${value}`)
      .join('\n');

    return `${this.title}: \n\n${bullets}\n`;
  }
}
