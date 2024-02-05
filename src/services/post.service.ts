import { CustomException } from '@common/exception/custom.exception';
import { PageQueryDto } from '@dtos/page.query.dto';
import { PatchPostDto } from '@dtos/posts/patch.post.dto';
import { PostPostDto } from '@dtos/posts/post.post.dto';
import { SpacePostParamDto } from '@dtos/posts/space.post.parma.dto';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { Post } from '@entities/post.entity';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { IPostFileList } from '@models/interfaces/i.post';
import { ISpaceUserRelation } from '@models/interfaces/i.space.return';
import { IUser } from '@models/interfaces/i.user';
import { Injectable } from '@nestjs/common';
import { DayjsProvider } from '@providers/dayjs.provider';
import { S3Provider } from '@providers/s3.provider';
import { PostRepository } from '@repositories/post.repository';
import { SpaceRepository } from '@repositories/space.repository';
import { UserRepository } from '@repositories/user.repository';
import { CommonUtil } from '@utils/common.util';
import { DbUtil } from '@utils/db.util';
import { EntityManager } from 'typeorm';

@Injectable()
export class PostService {

    constructor(
        private readonly db: DbUtil,
        private readonly util: CommonUtil,

        private readonly dayjs: DayjsProvider,
        private readonly s3: S3Provider,

        private readonly spaceRepo: SpaceRepository,
        private readonly postRepo: PostRepository,
        private readonly userRepo: UserRepository
    ) { };

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

                if (postCategory === 'notice') {
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
        userSpaceRelation: ISpaceUserRelation,
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

    async postList(
        userSpaceRelation: ISpaceUserRelation,
        param: SpaceParamDto,
        query: PageQueryDto
    ): Promise<
        Array<Pick<
            Post, 'createdAt' | 'isAnonymous' | 'postId' | 'postName' | 'userId' | 'postCategory'>>
    > {

        const { spaceId } = param;
        const { spaceRole } = userSpaceRelation;
        const { roleLevel } = spaceRole;
        const {
            page,
            pageCount: take,
            sortCreated
        } = query;

        const skip = this.util.skipedItem(page, take);

        const postList = await this.postRepo.getPostListBySpaceId(
            spaceId,
            skip,
            take,
            sortCreated
        );

        return await Promise.all(postList.map(async (post, i) => {

            const { isAnonymous, postName, postId, createdAt, postCategory } = post;

            const userId = isAnonymous && roleLevel === 'joiner' ? 0 : post.userId;
            return {
                isAnonymous,
                postName,
                postCategory,
                postId,
                userId: post.userId === userSpaceRelation.userId ? post.userId : userId,
                createdAt: this.dayjs.getDatetimeWithOffset(createdAt, 'YYYY-MM-DD HH:mm', {
                    value: -540,
                    unit: 'minute'
                })
            }
        }));

    };

    async getPost(
        userSpaceRelation: ISpaceUserRelation,
        param: SpacePostParamDto
    ) {

        const { spaceId, postId } = param;
        const { userId, spaceRole } = userSpaceRelation;
        const { roleLevel } = spaceRole;

        const post = await this.postRepo.getPostRelationByPostId(postId);
        if (!post) {
            throw new CustomException(
                "게시글을 찾을 수 없습니다.",
                ECustomExceptionCode["POST-001"],
                403
            )
        };
        const {
            postName,
            postCategory,
            postContents,
            postFiles,
            isAnonymous
        } = post;

        const postFileList = postFiles.length > 0 ? await Promise.all(postFiles.map(async (file, i) => {

            const { postFileName } = file;

            return {
                getPresignedUrl: await this.s3.getPresignedUrl(`${userId}/${spaceId}/${postId}/${postFileName}`),
                idx: i + 1
            }
        })) : [];

        const user = await this.userRepo.getUserById(userId);
        if (!user) {
            throw new CustomException(
                "존재하지 않는 회원",
                ECustomExceptionCode['USER-001'],
                403
            )
        };
        const { email, firstName, lastName, profileImage } = user;

        let showUser = true;
        if (isAnonymous) {

            if (post.userId !== userId && roleLevel === 'joiner') {
                showUser = false;
            }
        };

        const userImage = profileImage ? 
            await this.s3.getPresignedUrl(`${userId}/${spaceId}/${profileImage}`) : 
            await this.s3.getPresignedUrl(`defaultImage.png`)

        return {
            postName,
            postCategory,
            postContents,
            postId,
            postFiles: postFileList,
            userId: showUser ? post.userId : 0,
            name: showUser ? lastName + firstName : '',
            email: showUser ? email : '',
            profileImage: showUser ?
                userImage :
                await this.s3.getPresignedUrl(`defaultImage.png`)
        };



    };

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
