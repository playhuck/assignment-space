import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { DbUtil } from '@utils/db.util';

import { UserRepository } from '@repositories/user.repository';

import { PostSignInDto } from '@dtos/auths/post.sign.in.dto';
import { PostSignUpDto } from '@dtos/auths/post.sign.up.dto';
import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { BcryptProvider } from '@providers/bcrypt.provider';
import { JwtProvider } from '@providers/jwt.provider';

@Injectable()
export class AuthService {

    constructor(
        private readonly db: DbUtil,

        private readonly bcrypt: BcryptProvider,
        private readonly jwt: JwtProvider,

        private readonly userRepo: UserRepository
    ) { }

    async signUp(
        body: PostSignUpDto
    ) {

        void await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const {
                    email,
                    password,
                    passwordCheck
                } = args.body;

                const getAuthentificData = await this.userRepo.getAuthentificData(email);
                if (getAuthentificData) {
                    throw new CustomException(
                        "중복된 아이디입니다.",
                        ECustomExceptionCode['USER-001'],
                        400
                    );
                };
                
                const matched = this.bcrypt.matchedPassword(
                    password,
                    passwordCheck
                );
                if (!matched) {
                    throw new CustomException(
                        "비밀번호가 일치하지 않습니다.",
                        ECustomExceptionCode["INCORECT-PWD"],
                        400
                    );
                };
                
                const hashedPassword = await this.bcrypt.hashPassword(password);
                
                const insertUserEntity = await this.userRepo.insertUserEntity(
                    entityManager,
                    body,
                    hashedPassword
                );
                if (insertUserEntity.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "회원가입에 실패 했습니다.",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };
                
            }, { body });

    };

    async signIn(
        body: PostSignInDto
    ) {

        const { email, password } = body;

        const getAuthentificData = await this.userRepo.getAuthentificData(email);
        if (!getAuthentificData) {
            throw new CustomException(
                "존재하지 않는 유저입니다.",
                ECustomExceptionCode['USER-002'],
                400
            );
        };
        
        const compared = await this.bcrypt.comparedPassword(
            password,
            getAuthentificData.password
        );
        
        if (!compared) {
            throw new CustomException(
                "비밀번호가 일치하지 않습니다.",
                ECustomExceptionCode['INCORECT-DB-PWD'],
                400
            );
        };

        const accessToken = this.jwt.signAccessToken({
            type: 'AccessToken',
            userId: getAuthentificData.userId
        });

        const refreshToken = this.jwt.signRefreshToken({
            type: 'RefreshToken',
            userId: getAuthentificData.userId
        });

        return {
            accessToken,
            refreshToken
        }

    };
}
