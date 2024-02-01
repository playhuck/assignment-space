import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TNODE_ENV } from '@models/types/t.node.env';
import { LoggerUtil } from '@utils/logger.util';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {

    stage: TNODE_ENV;
    logger: LoggerUtil;

    constructor(stage: TNODE_ENV) {
        this.stage = stage;
        this.logger = stage === 'dev' ? new LoggerUtil() : undefined as unknown as LoggerUtil;
    };
    
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                if (data) {
                    const res = context.switchToHttp().getResponse();
                    const request = context.switchToHttp().getRequest<Request>();

                    this.logger.info(request.url, 'has been excuted')

                    if ('tokens' in data) {
                        const { tokens, ...datas } = data;
                        const { accessToken, refreshToken } = tokens;
                        const bearerToken = `Bearer ${accessToken}`;
                        res.header('Authorization', bearerToken);
                        res.setHeader('Set-Cookie', [
                            `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/;`,
                        ]);

                        return { isSuccess: true, ...datas };
                    } else {
                        return { isSuccess: true, ...data };
                    }
                } else {
                    return { isSuccess: true };
                };
            })
        );
    }
}