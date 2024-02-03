
import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtProvider } from '@providers/jwt.provider';
import { CustomException } from '@common/exception/custom.exception';

import {
    ECustomExceptionCode
} from '@models/enums/e.exception.code';
import { UserRepository } from '@repositories/user.repository';

@Injectable()
export class JwtUserGuard implements CanActivate {
    constructor(
        private jwt: JwtProvider,
        private readonly userRepo: UserRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = await context.switchToHttp().getRequest();
        const response: Response = await context.switchToHttp().getResponse();

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new CustomException(
                'JWT 토큰이 누락되었습니다.',
                ECustomExceptionCode['JWT-001'],
                401
            );
        }
        
        const payload = this.jwt.verifyToken(token);
        if (payload['type'] !== 'AccessToken') {
            throw new CustomException(
                "ACCESS 토큰타입이 아닙니다.",
                ECustomExceptionCode["JWT-002"],
                401
            )
        };

        const user = await this.userRepo.getUserById(payload['userId']);
        if (!user) {
            throw new CustomException(
                "존재하지 않는 유저입니다.",
                ECustomExceptionCode["USER-002"],
                401
            )
        };

        const { password, spaces, spaceUserRoles, ...data } = user;

        response["user"] = data;

        return true;
    };

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}