import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { JwtProvider } from '@providers/jwt.provider';
import { CustomException } from '@common/exception/custom.exception';

import {
    ECustomExceptionCode
} from '@models/enums/e.exception.code';
import { UserRepository } from '@repositories/user.repository';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
    constructor(
        private jwt: JwtProvider,
        private readonly userRepo: UserRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = await context.switchToHttp().getRequest();
        const response: Response = await context.switchToHttp().getResponse();
        
        const refreshToken = request?.headers?.cookie?.split('=')[1];
        
        if (!refreshToken) {
            throw new CustomException(
                'JWT 토큰이 누락되었습니다.',
                ECustomExceptionCode['JWT-001'],
                401
            );
        }
        
        const payload = await this.jwt.refreshVerifyToken(refreshToken);
        if (payload['type'] !== 'RefreshToken') {
            throw new CustomException(
                "REFRESH 토큰타입이 아닙니다.",
                ECustomExceptionCode["JWT-002"],
                401
            )
        };

        const user = await this.userRepo.getUserById(payload['userId']);
        if (!user){
            throw new CustomException(
                "존재하지 않는 유저입니다.",
                ECustomExceptionCode["USER-002"],
                401
            )
        };

        response["userId"] = payload['userId'];

        return true;
    }

}