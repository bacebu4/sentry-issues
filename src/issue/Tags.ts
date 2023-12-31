export class Tags {
  public constructor(private readonly tagsMap: Map<string, Map<string, number>>) {}

  public get values(): {
    key: string;
    values: { value: string; count: number; percentage: string }[];
  }[] {
    return [...this.tagsMap.entries()].map(([key, values]) => {
      const overallCountPerKey = [...values.entries()].reduce((acc, [, count]) => acc + count, 0);

      return {
        key,
        values: [...values.entries()].map(([value, count]) => ({
          value,
          count,
          percentage: ((count / overallCountPerKey) * 100).toFixed(2) + '%',
        })),
      };
    });
  }
}
