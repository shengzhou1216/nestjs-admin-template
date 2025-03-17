import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { Response } from '@app/common/response/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    return next.handle().pipe(map((data) => {
      if (data instanceof Response) {
        return data;
      }
        return Response.success(data);
      }),
    );
  }
}
