import { HttpStatus } from '@nestjs/common';
import { AppError, ErrorCodes } from 'src/common/error/app.error';

export default {
  INVALID_CREDENTIALS: new AppError(
    'Invalid credentials.',
    HttpStatus.UNAUTHORIZED,
    ErrorCodes.INVALID_CREDENTIALS,
  ),
  ALREADY_REGISTERED: new AppError(
    'User already registered.',
    HttpStatus.CONFLICT,
    ErrorCodes.DUPLICATED_VALUE,
  ),
  MISSING_AUTHORIZATION: new AppError(
    'Missing authorization.',
    HttpStatus.UNAUTHORIZED,
    ErrorCodes.MISSING_AUTHORIZATION,
  ),
  INVALID_AUTHORIZATION: new AppError(
    'Invalid authorization.',
    HttpStatus.UNAUTHORIZED,
    ErrorCodes.INVALID_CREDENTIALS,
  ),
  INCORRECT_SCHEMA: new AppError(
    'Incorrect schema. It should be "basic".',
    HttpStatus.UNAUTHORIZED,
    ErrorCodes.INCORRECT_SCHEMA,
  ),
  NOT_FOUND: new AppError(
    'Credentials not found.',
    HttpStatus.NOT_FOUND,
    ErrorCodes.NOT_FOUND,
  ),
};
