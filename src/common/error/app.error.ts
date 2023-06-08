import { HttpStatus } from '@nestjs/common';

export enum ErrorCodes {
  UNKNOW = 'app.unknow',
  INVALID_CREDENTIALS = 'auth.inv.cred',
  DUPLICATED_VALUE = 'app.dupl.val',
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
