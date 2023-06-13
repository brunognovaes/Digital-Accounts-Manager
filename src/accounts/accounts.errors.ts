import { HttpStatus } from '@nestjs/common';
import { AppError, ErrorCodes } from 'src/common/error/app.error';

export default {
  NOT_FOUND: new AppError(
    'Account not found.',
    HttpStatus.NOT_FOUND,
    ErrorCodes.NOT_FOUND,
  ),
  INACTIVE: new AppError(
    'Account is inactive.',
    HttpStatus.FORBIDDEN,
    ErrorCodes.INACTIVE_ACCOUNT,
  ),
  BLOCKED: new AppError(
    'Account is blocked.',
    HttpStatus.FORBIDDEN,
    ErrorCodes.BLOCKED_ACCOUNT,
  ),
  NOT_ENOUGH_BALANCE: new AppError(
    'Not enough balance.',
    HttpStatus.UNPROCESSABLE_ENTITY,
    ErrorCodes.INSUFFICIENT_BALANCE,
  ),
};
