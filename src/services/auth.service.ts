import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { DbUtil } from '@utils/db.util';

import { UserRepository } from '@repositories/user.repository';

import { User } from '@entities/user.entity';

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

        const token = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const {
                    email,
                    password,
                    passwordCheck
                } = args.body;

                const isEmail = await this.userRepo.isEmail(email);
                if(isEmail) {
                    throw new CustomException(
                        "중복된 아이디",
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
                        "비밀번호가 일치하지 않습니다",
                        ECustomExceptionCode["INCORECT-PWD"],
                        400
                    );
                };

            }, { body })
    };

    async signIn(
        body: PostSignInDto
    ) { };
}
