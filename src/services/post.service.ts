import { CustomException } from '@common/exception/custom.exception';
import { PostPostDto } from '@dtos/posts/post.post.dto';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { IUser } from '@models/interfaces/i.user';
import { Injectable } from '@nestjs/common';
import { DayjsProvider } from '@providers/dayjs.provider';
import { S3Provider } from '@providers/s3.provider';
import { PostRepository } from '@repositories/post.repository';
import { SpaceRepository } from '@repositories/space.repository';
import { DbUtil } from '@utils/db.util';
import { EntityManager } from 'typeorm';

@Injectable()
export class PostService {

    constructor(
        private readonly db: DbUtil,

        private readonly dayjs: DayjsProvider,
        private readonly s3: S3Provider,

        private readonly spaceRepo: SpaceRepository,
        private readonly postRepo: PostRepository
    ){};

    async postQuestion(
        user: IUser,
        param: SpaceParamDto,
        body: PostPostDto
    ) {

        const putPresignedUrlList = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { spaceId } = param;
                const {
                    postContents,
                    postFileList,
                    postName,
                    isAnonymous,
                    postCategory
                } = body;

                if(postCategory === 'notice'){
                    throw new CustomException(
                        "잘못된 게시글 카테고리",
                        ECustomExceptionCode["POST-002"],
                        400
                    )
                };

                const getSpaceRelation = await this.spaceRepo.getUserSpaceRelation(
                    spaceId,
                    userId
                );
                if (isAnonymous && getSpaceRelation?.spaceRole.roleLevel !== 'joiner') {
                    throw new CustomException(
                        "참여자만 익명으로 작성할 수 있습니다.",
                        ECustomExceptionCode['ROLE-005'],
                        401
                    )
                };

                const insertPost = await this.postRepo.insertPostQuestion(
                    entityManager,
                    spaceId,
                    userId,
                    {
                        postContents,
                        postName,
                        isAnonymous,
                        postCategory
                    },
                    this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss')

                );
                if (insertPost.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "게시글 작성에 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

                const { insertId: postId } = insertPost.raw;

                let putPresignedUrlList: Array<{
                    idx: number,
                    putPresignedUrl: string
                }> = [];

                if (postFileList.length > 0) {
                    putPresignedUrlList = await Promise.all(
                        postFileList.sort((a, b) => a.fileId - b.fileId)
                            .map(async (file, i) => {

                                const { fileExtension, fileName } = file;
                                const createdAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                                const insertPostFile = await this.postRepo.insertPostFile(
                                    entityManager,
                                    postId,
                                    fileName,
                                    createdAt
                                );
                                if (insertPostFile.generatedMaps.length !== 1) {
                                    throw new CustomException(
                                        "게시글 파일/이미지 생성에 실패",
                                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                                        500
                                    )
                                };

                                const putPresignedUrl = await this.s3.putPresignedUrlForPost(
                                    userId,
                                    spaceId,
                                    postId,
                                    fileName,
                                    fileExtension
                                );

                                return {
                                    idx: i + 1,
                                    putPresignedUrl
                                };

                            }));
                };

                return putPresignedUrlList;

            }, {
            user,
            param,
            body
        });

        return putPresignedUrlList;

    };

    async postNotice(
        user: IUser,
        param: SpaceParamDto,
        body: PostPostDto
    ) {

        const putPresignedUrlList = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { spaceId } = param;
                const {
                    postContents,
                    postFileList,
                    postName,
                    isAnonymous,
                    postCategory
                } = body;
                const createdAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                if (postCategory === 'question') {
                    throw new CustomException(
                        "잘못된 게시글 카테고리",
                        ECustomExceptionCode["POST-002"],
                        400
                    )
                };

                const getSpaceRelation = await this.spaceRepo.getUserSpaceRelation(
                    spaceId,
                    userId
                );
                if (isAnonymous) {
                    throw new CustomException(
                        "공지는 익명으로 작성할 수 없습니다.",
                        ECustomExceptionCode['ROLE-005'],
                        401
                    );
                };
                if (
                    getSpaceRelation?.spaceRole.spacePostNotice !== 1 ||
                    getSpaceRelation?.spaceRole.roleLevel === 'joiner'
                ) {
                    throw new CustomException(
                        "공지를 작성할 권한이 없습니다.",
                        ECustomExceptionCode["ROLE-006"],
                        401
                    );
                };

                const insertPost = await this.postRepo.insertPostQuestion(
                    entityManager,
                    spaceId,
                    userId,
                    {
                        postContents,
                        postName,
                        isAnonymous,
                        postCategory
                    },
                    createdAt

                );
                if (insertPost.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "게시글 작성에 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

                const { insertId: postId } = insertPost.raw;

                let putPresignedUrlList: Array<{
                    idx: number,
                    putPresignedUrl: string
                }> = [];

                if (postFileList.length > 0) {
                    putPresignedUrlList = await Promise.all(
                        postFileList.sort((a, b) => a.fileId - b.fileId)
                            .map(async (file, i) => {

                                const { fileExtension, fileName } = file;

                                const insertPostFile = await this.postRepo.insertPostFile(
                                    entityManager,
                                    postId,
                                    fileName,
                                    createdAt
                                );
                                if (insertPostFile.generatedMaps.length !== 1) {
                                    throw new CustomException(
                                        "게시글 파일/이미지 생성에 실패",
                                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                                        500
                                    )
                                };

                                const putPresignedUrl = await this.s3.putPresignedUrlForPost(
                                    userId,
                                    spaceId,
                                    postId,
                                    fileName,
                                    fileExtension
                                );

                                return {
                                    idx: i + 1,
                                    putPresignedUrl
                                };

                            }));
                };

                return putPresignedUrlList;

            }, {
            user,
            param,
            body
        });

        return putPresignedUrlList;

    };
    
    async postUpdate(){};
    
    async postDelete(){};

    async postList(){};

    async getPost(){};
}
