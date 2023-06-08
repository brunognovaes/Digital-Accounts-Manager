import { HttpStatus } from '@nestjs/common';

export enum ErrorCodes {
  UNKNOW = 'app.unknow',
  INVALID_CREDENTIALS = 'auth.inv.cred',
  DUPLICATED_VALUE = 'app.dupl.val',
  MISSING_AUTHORIZATION = 'app.miss.auth',
  INCORRECT_SCHEMA = 'app.incr.schm',
  NOT_FOUND = 'app.not.found',
}

export class AppError extends Error {
  constructor(
    public message: string,
    public httpStatus: HttpStatus,
    public errorCode: ErrorCodes,
  ) {
    super(message);
  }
}
