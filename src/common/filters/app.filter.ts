import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AppError } from '../error/app.error';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: AppError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const response = host.switchToHttp().getResponse();

    console.log('AppErrorFilter: ', exception);

    httpAdapter.reply(
      response,
      {
        errorCode: exception.errorCode,
        message: exception.message,
      },
      exception.httpStatus,
    );
  }
}
