export class Tags {
  private tagsMap: Map<string, Map<string, number>>;

  public constructor(private readonly rawTags: { key: string; value: string }[]) {
    this.tagsMap = new Map(this.rawTags.map(t => [t.key, new Map()]));

    this.rawTags.forEach(t => {
      const correspondingMap = this.tagsMap.get(t.key);
      const valueOfCorrespondingMap = correspondingMap?.get(t.value);
      if (valueOfCorrespondingMap !== undefined) {
        correspondingMap?.set(t.value, valueOfCorrespondingMap + 1);
      } else {
        correspondingMap?.set(t.value, 1);
      }
    });
  }

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
