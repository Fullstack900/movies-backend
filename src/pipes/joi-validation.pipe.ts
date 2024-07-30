import { PipeTransform, Injectable } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { plainToInstance } from 'class-transformer';
import { ObjectSchema, ValidationOptions } from 'joi';

import { ValidationBadRequestException } from '../exceptions/validation-bad-request-exception';

@Injectable()
export class JoiValidationPipe<T> implements PipeTransform {
  constructor(private schema: ObjectSchema<T>, private options?: ValidationOptions) {
    console.log("🚀 ~ JoiValidationPipe<T> ~ options:", options)
  }

  transform(values: T, meta: ArgumentMetadata) {
    console.log("🚀 ~ JoiValidationPipe<T> ~ transform ~ values:", values)
    const { value, error } = this.schema.validate(values, this.options);

    if (error) {
      throw new ValidationBadRequestException(error, 'Validation failed');
    }
    return meta.metatype ? plainToInstance(meta.metatype, value) : value;
  }
}
