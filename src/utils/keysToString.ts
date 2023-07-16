const isNumber = (n: string | number) => !Number.isNaN(Number(n));

export const keysToString = (keys: (string | number)[]) => {
  let result = '';

  for (const key of keys) {
    if (isNumber(key)) {
      result += `[${key}]`;
    } else {
      result += '.' + key;
    }
  }

  return result.slice(1);
};
