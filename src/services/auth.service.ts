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

        const tokens = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { email, password } = args.body;

                const getAuthentificData = await this.userRepo.getAuthentificData(email);
                if (!getAuthentificData) {
                    throw new CustomException(
                        "존재하지 않는 유저입니다.",
                        ECustomExceptionCode['USER-002'],
                        400
                    );
                };
                
                if (getAuthentificData?.refreshToken) {
                    throw new CustomException(
                        "중복 로그인은 허용되지 않습니다.",
                        ECustomExceptionCode["USER-003"],
                        401
                    )
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

                const updateUserRefresh = await this.userRepo.updateUserRefresh(
                    entityManager,
                    getAuthentificData.userId,
                    refreshToken
                );
                if (updateUserRefresh.affected !== 1) {
                    throw new CustomException(
                        "REFRESH 토큰 저장 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

                return {
                    accessToken,
                    refreshToken
                }

            }, { body });

        return tokens;

    };

    async getAccessToken(
        userId: number
    ) {

        const accessToken = this.jwt.signAccessToken({
            type: 'AccessToken',
            userId
        });

        return { accessToken };

    };

    async clearRefreshToken(
        userId: number
    ) {

        await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { userId } = args;

                const clearRefreshToken = await this.userRepo.clearUserRefresh(
                    entityManager, 
                    userId
                );
                if (clearRefreshToken.affected !== 1) {
                    throw new CustomException(
                        "REFRESH 토큰을 비우지 못했습니다.",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

            }, { userId })
    }
}
