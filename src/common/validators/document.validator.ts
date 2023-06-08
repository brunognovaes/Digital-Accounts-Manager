import { registerDecorator, ValidationOptions } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isDocument',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return cpf.isValid(value);
        },
        defaultMessage({ property }) {
          return `${property} must contain a valid CPF.`;
        },
      },
    });
  };
}
