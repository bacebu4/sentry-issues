export const exhaustiveMatchingGuard = (_: never): never => {
  throw new Error('Unreachable');
};
