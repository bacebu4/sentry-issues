import { Result } from '../utils';

export type JsonValue =
  | string
  | number
  | boolean
  | { [x: string]: JsonValue }
  | Array<JsonValue>
  | null;

export interface IJsonParser<T extends JsonValue> {
  execute(payload: unknown): Result<T, { message: string }>;
}
