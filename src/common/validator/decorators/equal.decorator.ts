import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

/**
 * validate if the value is equal to the related property
 * @param property
 * @param validationOptions
 * @constructor
 */
export function IsEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
