import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

import { CustomException } from '@common/exception/custom.exception';

import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { IJWT_ENV } from '@models/interfaces/i.config';

declare module "jsonwebtoken" {
    export type CustomTokenType = "AccessToken"

    export interface ICustomPayload extends jwt.JwtPayload {
        type: CustomTokenType;
    }

    export interface IAccessTokenPayload extends ICustomPayload {
        type: CustomTokenType;
        staffId: number;
        account: string;
    }

    export interface IJwtReportPayload extends ICustomPayload {
    }

};

@Injectable()
export class JwtProvider {

    private readonly JWT_ENV: IJWT_ENV

    constructor(
        private readonly config: ConfigService
    ) {
        this.JWT_ENV = this.config.get<IJWT_ENV>('JWT')!
    }


    public signAccessToken(payload: jwt.IAccessTokenPayload): string {
        return jwt.sign(
            payload, this.JWT_ENV.JWT_SECRET_KEY,
            {
                expiresIn: '3d',
                algorithm: 'HS256'
            }
        )
    };

    public extractToken(bearerToken: string): string {
        return bearerToken.substring(7);
    }

    public verifyToken<T extends jwt.ICustomPayload>(token: string): T {

        try {
            return <T>jwt.verify(token, this.JWT_ENV.JWT_SECRET_KEY,
                {
                    algorithms: ['HS256'],
                }
            );

        } catch (err) {

            throw new CustomException(
                '토큰 검증 실패',
                ECustomExceptionCode['JWT-002'],
                401
            );
        }
    };

}