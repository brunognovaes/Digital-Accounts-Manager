import { HttpStatus } from '@nestjs/common';

export enum ErrorCodes {
  UNKNOW = 'app.unknow',
  INVALID_CREDENTIALS = 'auth.inv.cred',
  DUPLICATED_VALUE = 'app.dupl.val',
  MISSING_AUTHORIZATION = 'app.miss.auth',
  INCORRECT_SCHEMA = 'app.incr.schm',
  NOT_FOUND = 'app.not.found',
  INACTIVE_ACCOUNT = 'acc.incv',
  BLOCKED_ACCOUNT = 'acc.blck',
  INSUFFICIENT_BALANCE = 'acc.insf.bal',
  ALREADY_PROCESSED = 'tran.alrd.proc'
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
