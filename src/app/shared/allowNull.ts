import { ValidateIf, ValidationOptions } from 'class-validator';

export const AllowNull = (options?: ValidationOptions): PropertyDecorator =>
  ValidateIf((object, value) => value !== null, options);
