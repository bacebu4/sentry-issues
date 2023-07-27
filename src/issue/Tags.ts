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

    return [...result.entries()].map(([key, values]) => ({
      key,
      values: [...values.entries()].map(([value, count], _i, array) => {
        const allCount = array.reduce((acc, val) => acc + val[1], 0);
        return { value, count, percentage: ((count / allCount) * 100).toFixed(2) + '%' };
      }),
    }));
  }
}
