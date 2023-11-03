import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsInEnumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [enumClass] = args.constraints;
    if (Object.values(enumClass).includes(value)) {
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const [enumClass] = args.constraints;
    return `Invalid value for ${args.property}, must be one of ${Object.values(
      enumClass,
    ).join(', ')}.`;
  }
}

export function IsInEnum(
  enumClass: any,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isInEnum',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [enumClass],
      options: validationOptions,
      validator: IsInEnumConstraint,
    });
  };
}
