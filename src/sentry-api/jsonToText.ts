import { keysToString } from '../utils';

const isPossiblyAnObject = (o: unknown): o is {} => {
  const result = typeof o === 'object' && o !== null && o;
  return Boolean(result);
};

const jsonToKeysAndEntries = (
  object: {},
  result: [string[], string][] = [],
  prevKeys: string[] = [],
): [string[], string][] => {
  for (const [key, value] of Object.entries(object)) {
    const currentKey = [...prevKeys, key];

    if (isPossiblyAnObject(value)) {
      jsonToKeysAndEntries(value, result, currentKey);
    } else {
      const formattedValue = String(value).trim();
      result.push([currentKey, formattedValue]);
    }
  }

  return result;
};

export const jsonToText = (objectOrUnknown: unknown): string => {
  if (!isPossiblyAnObject(objectOrUnknown)) {
    return '';
  }

  const keysAndValues = jsonToKeysAndEntries(objectOrUnknown);

  const subPathsToExclude = ['stacktrace'];
  const valuesToExclude = ['[undefined]', '', 'null'];

  const withPrettyKeys: [string, unknown][] = keysAndValues
    .filter(([key]) => key.every(k => !subPathsToExclude.includes(k)))
    .filter(([, value]) => !valuesToExclude.includes(value))
    .map(([key, value]) => [keysToString(key), value]);

  const longestKey = withPrettyKeys.reduce((acc, [key]) => Math.max(acc, key.length), -Infinity);

  return withPrettyKeys.map(([key, value]) => `${key.padEnd(longestKey)}: ${value}`).join('\n');
};
