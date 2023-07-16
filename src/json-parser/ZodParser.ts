import { z } from 'zod';
import { IJsonParser, JsonValue } from './IJsonParser';
import { Result, keysToString } from '../utils';

export class ZodParser<T extends JsonValue> implements IJsonParser<T> {
  constructor(private readonly schema: z.ZodType<T>) {}

  execute(payload: unknown): Result<T, { message: string }> {
    const result = this.schema.safeParse(payload);

    if (result.success === true) {
      return { isSuccess: true as const, data: result.data };
    }

    return {
      isSuccess: false as const,
      error: { message: this.formatError(result.error) },
    };
  }

  private formatError(error: z.ZodError<any>) {
    return error.issues.map(i => `${i.code}: ${i.message} (${keysToString(i.path)})`).join('; ');
  }
}
