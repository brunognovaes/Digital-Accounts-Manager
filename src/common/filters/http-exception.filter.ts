import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorCodes } from '../error/app.error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const response = host.switchToHttp().getResponse();

    console.log('HttpExceptionFilter: ', exception);

    const status = exception.getStatus();

    httpAdapter.reply(
      response,
      {
        errorCode: ErrorCodes.UNKNOW,
        message: exception.message,
      },
      status,
    );
  }
}
