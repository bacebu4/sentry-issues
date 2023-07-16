export type Result<TData, TError> =
  | { isSuccess: false; error: TError }
  | { isSuccess: true; data: TData };
