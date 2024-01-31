import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                if (data) {
                    const httpRes = context.switchToHttp().getResponse();

                    if ('signUp' in data) {
                        const { login, ...datas } = data;
                        const bearerToken = `Bearer ${data['signUp']}`;
                        httpRes.header('Authorization', bearerToken);
                        return { isSuccess: true, ...datas };
                    } else {
                        return { isSuccess: true, ...data };
                    }
                } else {
                    return { isSuccess: true };
                }
            })
        );
    }
}