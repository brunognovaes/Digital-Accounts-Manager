import { HttpStatus } from '@nestjs/common';
import { AppError, ErrorCodes } from 'src/common/error/app.error';

export default {
  INVALID_CREDENTIALS: new AppError(
    'Invalid credentials.',
    HttpStatus.UNAUTHORIZED,
    ErrorCodes.INVALID_CREDENTIALS,
  ),
};
