import { HttpStatus } from '@nestjs/common';
import { AppError, ErrorCodes } from 'src/common/error/app.error';

export default {
  ALREADY_REGISTERED: new AppError(
    'Document already registered.',
    HttpStatus.CONFLICT,
    ErrorCodes.DUPLICATED_VALUE,
  ),
  NOT_FOUND: new AppError(
    'Holder not found.',
    HttpStatus.NOT_FOUND,
    ErrorCodes.NOT_FOUND,
  ),
};
