import { CustomException } from '@common/exception/custom.exception';
import { PatchPostDto } from '@dtos/posts/patch.post.dto';
import { PostPostDto } from '@dtos/posts/post.post.dto';
import { SpacePostParamDto } from '@dtos/posts/space.post.parma.dto';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { IPostFileList } from '@models/interfaces/i.post';
import { ISpaceUserRoleRelationSpaceAndSpaceRole } from '@models/interfaces/i.space.return';
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
                const createdAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

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
                        "익명 작성 규칙 위반",
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
                    putPresignedUrlList = await this.postUploadFileList(
                        entityManager,
                        userId,
                        spaceId,
                        postId,
                        postFileList,
                        createdAt
                    );
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
                        "익명 작성 규칙 위반",
                        ECustomExceptionCode['ROLE-005'],
                        401
                    );
                };
                if (
                    getSpaceRelation?.spaceRole.spacePostNotice !== 1 ||
                    getSpaceRelation?.spaceRole.roleLevel === 'joiner'
                ) {
                    throw new CustomException(
                        "공지사항 작성 규칙 위반",
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
                    putPresignedUrlList = await this.postUploadFileList(
                        entityManager,
                        userId,
                        spaceId,
                        postId,
                        postFileList,
                        createdAt
                    );
                };

                return putPresignedUrlList;

            }, {
            user,
            param,
            body
        });

        return putPresignedUrlList;

    };
    
    async updateQuestion(
        user: IUser,
        param: SpacePostParamDto,
        body: PatchPostDto
    ) {

        const putPresignedUrlList = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { spaceId, postId } = param;
                const {
                    postContents,
                    postFileList,
                    postName,
                    isAnonymous
                } = body;

                const updatedAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                const getUserSpaceRelation = await this.spaceRepo.getUserSpaceRelation(
                    spaceId,
                    userId
                );
                if (isAnonymous && getUserSpaceRelation?.spaceRole.roleLevel !== 'joiner') {
                    throw new CustomException(
                        "익명 작성 규칙 위반",
                        ECustomExceptionCode['ROLE-005'],
                        401
                    );
                };

                const updatePost = await this.postRepo.updatePost(
                    entityManager,
                    postId,
                    postName,
                    postContents,
                    updatedAt,
                    isAnonymous
                );
                if (updatePost.affected !== 1) {
                    throw new CustomException(
                        "질문 수정 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

                let putPresignedUrlList: Array<{
                    idx: number,
                    putPresignedUrl: string
                }> = [];

                const getPostFileListByPostId = await this.postRepo.getPostFileListByPostId(postId);
                const deletePostFiles = await this.postRepo.deletePostFiles(
                    entityManager,
                    postId
                );
                if (getPostFileListByPostId.length !== deletePostFiles.affected) {
                    throw new CustomException(
                        "게시글 파일 삭제 처리에 실패",
                        ECustomExceptionCode['AWS-RDS-EXCEPTION'],
                        500
                    )
                };

                if (postFileList.length > 0) {
                    putPresignedUrlList = await this.postUploadFileList(
                        entityManager,
                        userId,
                        spaceId,
                        postId,
                        postFileList,
                        updatedAt
                    );
                };

                return putPresignedUrlList;

            }, {
            user,
            param,
            body
        });

        return putPresignedUrlList;

    };

    async updateNotice(
        user: IUser,
        param: SpacePostParamDto,
        body: PatchPostDto
    ) {

        const putPresignedUrlList = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { spaceId, postId } = param;
                const {
                    postContents,
                    postFileList,
                    postName,
                    isAnonymous
                } = body;

                const updatedAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                const getUserSpaceRelation = await this.spaceRepo.getUserSpaceRelation(
                    spaceId,
                    userId
                );
                if (isAnonymous) {
                    throw new CustomException(
                        "익명 작성 규칙 위반",
                        ECustomExceptionCode['ROLE-005'],
                        401
                    );
                };

                if (
                    getUserSpaceRelation?.spaceRole.roleLevel === 'joiner' ||
                    getUserSpaceRelation?.spaceRole.spacePostNotice === 0
                ) {
                    throw new CustomException(
                        "공지사항 작성 규칙 위반",
                        ECustomExceptionCode["ROLE-006"],
                        401
                    )
                };

                const updatePost = await this.postRepo.updatePost(
                    entityManager,
                    postId,
                    postName,
                    postContents,
                    updatedAt,
                    isAnonymous
                );
                if (updatePost.affected !== 1) {
                    throw new CustomException(
                        "질문 수정 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

                let putPresignedUrlList: Array<{
                    idx: number,
                    putPresignedUrl: string
                }> = [];

                const getPostFileListByPostId = await this.postRepo.getPostFileListByPostId(postId);
                const deletePostFiles = await this.postRepo.deletePostFiles(
                    entityManager,
                    postId
                );
                if (getPostFileListByPostId.length !== deletePostFiles.affected) {
                    throw new CustomException(
                        "게시글 파일 삭제 처리에 실패",
                        ECustomExceptionCode['AWS-RDS-EXCEPTION'],
                        500
                    )
                };

                if (postFileList.length > 0) {
                    putPresignedUrlList = await this.postUploadFileList(
                        entityManager,
                        userId,
                        spaceId,
                        postId,
                        postFileList,
                        updatedAt
                    );
                };

                return putPresignedUrlList;

            }, {
            user,
            param,
            body
        });

        return putPresignedUrlList

    };
    
    async postDelete(
        userSpaceRelation: ISpaceUserRoleRelationSpaceAndSpaceRole,
        param: SpacePostParamDto
    ) {

        void await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { userSpaceRelation, param } = args;
                const { userId } = userSpaceRelation;
                const { spaceId, postId } = param;

                const post = await this.postRepo.getPostByPostId(postId);
                if (!post) {
                    throw new CustomException(
                        "게시글을 찾을 수 업음",
                        ECustomExceptionCode["POST-001"],
                        403
                    )
                };

                if (post.userId !== userId) {

                    if (
                        post.postCategory === 'notice' &&
                        userSpaceRelation.spaceRole.spacePostAdminDelete !== 0) {
                        throw new CustomException(
                            "[공지사항]삭제 규칙 위반",
                            ECustomExceptionCode["ROLE-006"],
                            401
                        )
                    };

                    if (userSpaceRelation.spaceRole.roleLevel === 'joiner') {
                        throw new CustomException(
                            "[게시물]삭제 규칙 위반",
                            ECustomExceptionCode["ROLE-006"],
                            401
                        )
                    }
                };

                const getPostFileListByPostId = await this.postRepo.getPostFileListByPostId(postId);

                await Promise.all(getPostFileListByPostId.map(async (file, i) => {

                    const { postFileName } = file;
                    void await this.s3.deleteObject(`${userId}/${spaceId}/${postId}/${postFileName}`)
                }));

                const deletePost = await this.postRepo.deletePost(
                    entityManager,
                    postId
                );
                if (!deletePost.deletedAt) {
                    throw new CustomException(
                        "[게시글/공지] 삭제에 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

            }, {
            userSpaceRelation,
            param
        })
    };

    async postList(){};

    async getPost(){};

    private async postUploadFileList(
        entityManager: EntityManager,
        userId: number,
        spaceId: number,
        postId: number,
        postFileList: IPostFileList[],
        createdAt: string
    ) {

        return await Promise.all(
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
}
