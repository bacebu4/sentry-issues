export class Tags {
  public constructor(private readonly rawTags: { key: string; value: string }[]) {}

  public get values(): {
    key: string;
    values: { value: string; count: number; percentage: string }[];
  }[] {
    const result = new Map(this.rawTags.map(t => [t.key, new Map()]));

    this.rawTags.forEach(t => {
      const correspondingMap = result.get(t.key);
      if (correspondingMap?.has(t.value)) {
        correspondingMap.set(t.value, correspondingMap.get(t.value) + 1);
      } else {
        correspondingMap?.set(t.value, 1);
      }
    });

    return [...result.entries()].map(([key, values]) => {
      const overallCountPerKey = [...values.entries()].reduce((acc, val) => acc + val[1], 0);

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
