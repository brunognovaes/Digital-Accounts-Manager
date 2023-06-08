import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, void> {
  intercept(_, next: CallHandler): Observable<void> {
    return next.handle().pipe(
      map((data: any): any => {
        return { payload: data };
      }),
    );
  }
}
