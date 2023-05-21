import { ApiResponseDto } from '../dto/response.dto';

export abstract class AbstractSerializer<Input, Output> {
  public abstract serialize(input: Input): Output;

  public serializeOne(
    input: Input,
    meta?: Record<string, any>,
  ): ApiResponseDto<Output> {
    return { data: this.serialize(input), meta };
  }

  public serializeMany(
    input: Input[],
    meta?: Record<string, any>,
  ): ApiResponseDto<Output[]> {
    return {
      data: input.map((i) => this.serialize(i)),
      meta: { count: input.length, ...meta },
    };
  }

  public serializeIfDefined(input: undefined): undefined;

  public serializeIfDefined(input?: Input): Output;

  public serializeIfDefined(input?: Input[]): Output[];

  public serializeIfDefined(
    input?: Input | Input[],
  ): Output | Output[] | undefined {
    const isArray = Array.isArray(input);

    if (isArray) {
      return input.map((element) => this.serializeIfDefined(element)) as
        | Output
        | Output[];
    }

    return input ? this.serialize(input) : undefined;
  }
}
