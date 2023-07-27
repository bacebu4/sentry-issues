import { formatDistanceToNowStrict } from 'date-fns';

export class HumanDate {
  public constructor(private readonly value: Date) {}

  public static now(): HumanDate {
    return new HumanDate(new Date());
  }

  public get ago(): string {
    return `${formatDistanceToNowStrict(this.value)} ago`;
  }

  public toString(): string {
    return this.value.toLocaleString();
  }
}
