import { HttpStatus } from '@nestjs/common';
import { AppError, ErrorCodes } from 'src/common/error/app.error';

export default {
  NOT_FOUND: new AppError(
    'Transfer not found.',
    HttpStatus.NOT_FOUND,
    ErrorCodes.NOT_FOUND,
  ),
  ALREADY_PROCESSED: new AppError(
    'Transfer already processed.',
    HttpStatus.UNPROCESSABLE_ENTITY,
    ErrorCodes.ALREADY_PROCESSED,
  ),
  DAILY_TRANSFER_AMOUNT: new AppError(
    'Daily amount reached.',
    HttpStatus.BAD_REQUEST,
    ErrorCodes.DAILY_AMOUNT,
  ),
};
