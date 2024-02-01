import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerResponse } from 'http';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                if (data) {
                    const res: ServerResponse = context.switchToHttp().getResponse();

                    if ('tokens' in data) {
                        const { accessToken, refreshToken, ...datas } = data;
                        const bearerToken = `Bearer ${data['signUp']}`;
                        res.setHeader('Authorization', bearerToken);
                        res.setHeader('Set-Cookie', [
                            `yourCookieName=${refreshToken}; HttpOnly; Secure; Path=/;`,
                        ]);

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