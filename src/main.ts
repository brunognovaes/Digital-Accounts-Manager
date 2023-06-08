import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GenericErrorFilter } from './common/filters/index.filter';
import { AppErrorFilter } from './common/filters/app.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(
    new GenericErrorFilter(httpAdapterHost),
    new HttpExceptionFilter(httpAdapterHost),
    new AppErrorFilter(httpAdapterHost),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT || DEFAULT_PORT);
}

bootstrap();
