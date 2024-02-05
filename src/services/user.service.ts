import { Injectable } from '@nestjs/common';
import { DayjsProvider } from '@providers/dayjs.provider';
import { S3Provider } from '@providers/s3.provider';

import { CommonUtil } from '@utils/common.util';
import { DbUtil } from '@utils/db.util';

import { CommentRepository } from '@repositories/comment.repository';
import { PostRepository } from '@repositories/post.repository';
import { SpaceRepository } from '@repositories/space.repository';
import { UserRepository } from '@repositories/user.repository';

import { IUser } from '@models/interfaces/i.user';
import { DEFAULT_IMAGE } from '@common/constants/default.image';
import { UserParamDto } from '@dtos/users/user.param.dto';
import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { PatchUserNameDto } from '@dtos/users/patch.user.name.dto';
import { EntityManager } from 'typeorm';
import { PatchUserPasswordDto } from '@dtos/users/patch.user.password.dto';
import { PatchUserProfileImageDto } from '@dtos/users/patch.user.image.dto';
import { BcryptProvider } from '@providers/bcrypt.provider';
import { PageQueryDto } from '@dtos/page.query.dto';

@Injectable()
export class UserService {

    constructor(
        private readonly db: DbUtil,
        private readonly util: CommonUtil,

        private readonly dayjs: DayjsProvider,
        private readonly s3: S3Provider,
        private readonly bcrypt: BcryptProvider,

        private readonly spaceRepo: SpaceRepository,
        private readonly postRepo: PostRepository,
        private readonly userRepo: UserRepository,
        private readonly commentRepo: CommentRepository
    ) { };

    async getMyProfile(
        user: IUser
    ) {

        const {
            userId,
            email,
            lastName,
            firstName
        } = user;

        return {
            userId,
            email,
            lastName,
            firstName,
            profileImage: user?.profileImage ?
                await this.s3.getPresignedUrl(user?.profileImage) :
                await this.s3.getPresignedUrl(DEFAULT_IMAGE)
        };
    };

    async getOthersProfile(
        param: UserParamDto
    ) {

        const { userId } = param;

        const user = await this.userRepo.getUserById(userId);
        if (!user) {
            throw new CustomException(
                "존재하지 않는 유저",
                ECustomExceptionCode['USER-002'],
                403
            )
        };

        const {
            lastName,
            firstName
        } = user;

        return {
            userId,
            lastName,
            firstName,
            profileImage: user?.profileImage ?
                await this.s3.getPresignedUrl(user?.profileImage) :
                await this.s3.getPresignedUrl(DEFAULT_IMAGE)
        };

    };

    async getUserPostList(
        user: IUser,
        query: PageQueryDto
    ) {

        const { userId } = user;
        const {
            page,
            pageCount: take,
            sortCreated
        } = query;

        const skip = this.util.skipedItem(page, take);

        const postList = await this.postRepo.getPostListByUserId(
            userId,
            skip,
            take,
            sortCreated
        );

        return postList;

    };

    async getUserCommentList(
        user: IUser,
        query: PageQueryDto
    ){

        const { userId } = user;
        const { 
            page, 
            pageCount: take,
            sortCreated
        } = query;

        const skip = this.util.skipedItem(page, take);

        const commentList = await this.commentRepo.getCommentListByUserId(
            userId,
            skip,
            take,
            sortCreated
        );

        return commentList;

    }

    async updateUserName(
        user: IUser,
        body: PatchUserNameDto
    ) {

        void await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, body } = args;
                const { firstName, lastName } = body;
                const { userId } = user;

                const updateUserName = await this.userRepo.updateUserName(
                    entityManager,
                    userId,
                    firstName,
                    lastName
                );
                if(updateUserName.affected !== 1){
                    throw new CustomException(
                        "유저 이름 수정 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

        }, {
            user,
            body
        })
    };

    async updateUserPassword(
        user: IUser,
        body: PatchUserPasswordDto
    ) {

        void await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, body } = args;
                const { userId } = user;
                const { 
                    originPassword,
                    newPassword,
                    newPasswordCheck
                } = body;

                const password = await this.userRepo.getUserPassword(userId);
                
                const compare = await this.bcrypt.comparedPassword(
                    originPassword, password
                );
                if(!compare){
                    throw new CustomException(
                        "비밀번호 불일치",
                        ECustomExceptionCode["INCORECT-DB-PWD"],
                        400
                    )
                };

                const matched = this.bcrypt.matchedPassword(
                    newPassword,
                    newPasswordCheck
                );
                if(!matched){
                    throw new CustomException(
                        "비밀번호 불일치",
                        ECustomExceptionCode["INCORECT-PWD"],
                        400
                    )
                };

                const hashed = await this.bcrypt.hashPassword(newPassword);

                const updatePassword = await this.userRepo.updatePassword(
                    entityManager,
                    userId,
                    hashed
                );
                if(updatePassword.affected !== 1){
                    throw new CustomException(
                        "비밀번호 수정 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };
               

        }, {
            user,
            body
        })
    };

    async updateUserProfileImage(
        user: IUser,
        body: PatchUserProfileImageDto
    ) {

        const putPresignedUrl = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, body } = args;
                const { userId } = user;
                const {
                    profileImage
                } = body;

                const putPresignedUrl = await this.s3.putPresignedUrlForUser(
                    userId,
                    profileImage
                );

                const updateUserProfileImage = await this.userRepo.updateUserProfileImage(
                    entityManager,
                    userId,
                    profileImage
                );
                if (updateUserProfileImage.affected !== 1) {
                    throw new CustomException(
                        "유저 이미지 수정 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

                return putPresignedUrl;


            }, {
            user,
            body
        });

        return putPresignedUrl;

    };

}
