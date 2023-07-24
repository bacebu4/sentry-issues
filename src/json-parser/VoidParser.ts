import { Result } from '../utils';
import { IJsonParser, JsonValue } from './IJsonParser';

export class VoidParser implements IJsonParser<JsonValue> {
  public execute(): Result<JsonValue, { message: string }> {
    return { isSuccess: true, data: null };
  }
}
