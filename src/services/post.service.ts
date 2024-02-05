import { CustomException } from '@common/exception/custom.exception';
import { PageQueryDto } from '@dtos/page.query.dto';
import { PatchPostDto } from '@dtos/posts/patch.post.dto';
import { PostPostDto } from '@dtos/posts/post.post.dto';
import { SpacePostParamDto } from '@dtos/posts/space.post.parma.dto';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { Comment } from '@entities/post.comment.entity';
import { CommentReply } from '@entities/post.comment.reply.entity';
import { Post } from '@entities/post.entity';
import { PostFile } from '@entities/post.file.entity';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { IPostFileList, IPostList } from '@models/interfaces/i.post';
import { ISpaceUserRelation } from '@models/interfaces/i.space.return';
import { IUser } from '@models/interfaces/i.user';
import { TPostCategory } from '@models/types/t.post';
import { TRole, TRoleLevel } from '@models/types/t.role';
import { Injectable } from '@nestjs/common';
import { DayjsProvider } from '@providers/dayjs.provider';
import { S3Provider } from '@providers/s3.provider';
import { CommentRepository } from '@repositories/comment.repository';
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
        private readonly userRepo: UserRepository,
        private readonly commentRepo: CommentRepository
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
    ): Promise<{
        noticeList: IPostList[],
        questionList: IPostList[]
    }> {

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

        const postNotice: IPostList[] = [];
        const postQuestion: IPostList[] = [];

        await Promise.all(postList.map(async (post, i) => {

            const { isAnonymous, postName, postId, createdAt, postCategory } = post;

            const counts = await this.getCommentCounts(postId);

            const userId = isAnonymous && roleLevel === 'joiner' ? 0 : post.userId;

            const postObject = {
                isAnonymous,
                postName,
                postCategory,
                postId,
                userId: post.userId === userSpaceRelation.userId ? post.userId : userId,
                createdAt: this.dayjs.getDatetimeWithOffset(createdAt, 'YYYY-MM-DD HH:mm', {
                    value: -540,
                    unit: 'minute'
                }),
                counts
            }
            return postCategory === 'notice' ? postNotice.push(postObject) : postQuestion.push(postObject);
        }));

        const noticeList = await this.sortingPostList(postNotice);
        const questionList = await this.sortingPostList(postQuestion); /** index 4까지 인기게시물 */

        return {
            noticeList,
            questionList
        }

    };

    async getPost(
        userSpaceRelation: ISpaceUserRelation,
        param: SpacePostParamDto
    ) {

        const { spaceId, postId } = param;
        const {
            userId: viewerUserId,
            spaceRole
        } = userSpaceRelation;
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
            isAnonymous,
            postComments,
            userId: postUserId
        } = post;

        const postFileList = await this.getFilesUrlList(
            postFiles,
            post.userId,
            spaceId,
            postId
        );

        const user = await this.userRepo.getUserById(viewerUserId);
        if (!user) {
            throw new CustomException(
                "존재하지 않는 회원",
                ECustomExceptionCode['USER-001'],
                403
            )
        };
        const { email, firstName, lastName, profileImage } = user;

        let showAnonymous = this.showAnonymous(isAnonymous, post.userId, viewerUserId, roleLevel);

        const userImage = profileImage ?
            await this.s3.getPresignedUrl(`${postUserId}/${spaceId}/${profileImage}`) :
            await this.s3.getPresignedUrl(`defaultImage.png`);

        const commentList = await this.setCommentAnonymous(
            postComments,
            viewerUserId,
            roleLevel
        );

        return {
            postName,
            postCategory,
            postContents,
            postId,
            postFiles: postFileList,
            userId: showAnonymous ? post.userId : 0,
            name: showAnonymous ? lastName + firstName : '',
            email: showAnonymous ? email : '',
            profileImage: showAnonymous ?
                userImage :
                await this.s3.getPresignedUrl(`defaultImage.png`),
            commentList
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

    private async getFilesUrlList(
        postFiles: PostFile[],
        userId: number,
        spaceId: number,
        postId: number
    ) {

        const postFileList = postFiles.length > 0 ? await Promise.all(postFiles.map(async (file, i) => {

            const { postFileName } = file;

            return {
                getPresignedUrl: await this.s3.getPresignedUrl(`${userId}/${spaceId}/${postId}/${postFileName}`),
                idx: i + 1
            }
        })) : [];

        return postFileList;
    };

    private async getCommentCounts(
        postId: number
    ): Promise<{
        commentCount: number,
        dupCommentCount: number
    }> {

        let counts = {
            commentCount: 0,
            replyCount: 0,
            dupCommentCount: 0,
            dupReplyCount: 0
        }
        const commentList = await this.commentRepo.getCommentByPostId(postId);
        if (commentList.length === 0) {
            return {
                commentCount: 0,
                dupCommentCount: 0
            }
        };

        const uniqueCommentUsers = new Set(commentList.map(comment => comment.userId));
        counts.commentCount = uniqueCommentUsers.size;
        counts.dupCommentCount = commentList.length

        await Promise.all(commentList.map(
            async(comm, i) => {

                const { commentId } = comm;

                const getReplyList = await this.commentRepo.getReplyListByCommentId(commentId);

                if(getReplyList.length === 0) return;

                const uniqueReplyUsers = new Set(getReplyList.map(reply => reply.userId));
                counts.replyCount += uniqueReplyUsers.size;
                counts.dupReplyCount += getReplyList.length;

        }));

        return {
            commentCount: counts.commentCount + counts.replyCount,
            dupCommentCount: counts.dupCommentCount + counts.dupReplyCount
        };

    };

    async setCommentAnonymous(
        postComments: Comment[],
        viewerUserId: number,
        viewerRoleLevel: TRoleLevel
    ) {
        return await Promise.all(postComments.map(
            async (comm, i) => {

                const {
                    comment,
                    commentId,
                    commentReplys,
                    userId: commentUserId,
                    postId,
                    isAnonymous
                } = comm;

                const commentUser = await this.userRepo.getUserById(commentUserId);

                const showAnonymous = this.showAnonymous(
                    isAnonymous,
                    commentUserId,
                    viewerUserId,
                    viewerRoleLevel
                );

                const replys = await this.setReplyAnonymous(
                    commentReplys,
                    viewerUserId,
                    viewerRoleLevel
                );

                return {
                    comment,
                    commentId,
                    userId: !showAnonymous && isAnonymous ? 0 : commentUserId,
                    userName: !showAnonymous && isAnonymous ? '' : `${commentUser?.lastName}${commentUser?.firstName}`,
                    postId,
                    replys
                }
            }));
    };

    async setReplyAnonymous(
        commentReplys: CommentReply[],
        viewerUserId: number,
        viewerRoleLevel: TRoleLevel
    ) {
        return await Promise.all(commentReplys.map(
            async (reply) => {

                const {
                    commentReply,
                    replyId,
                    userId: replyUserId,
                    commentId,
                    isAnonymous
                } = reply;

                const replyUser = await this.userRepo.getUserById(replyUserId);
                const showAnonymous = this.showAnonymous(
                    isAnonymous,
                    replyUserId,
                    viewerUserId,
                    viewerRoleLevel
                );

                return {
                    commentReply,
                    replyId,
                    userId: !showAnonymous && isAnonymous ? 0 : replyUserId,
                    userName: !showAnonymous && isAnonymous ? '' : `${replyUser?.lastName}${replyUser?.firstName}`,
                    commentId
                }
            }));
    };

    async sortingPostList(sortingPostList: {
        isAnonymous: number;
        postName: string;
        postCategory: TPostCategory;
        postId: number;
        userId: number;
        createdAt: string;
        counts: {
            commentCount: number;
            dupCommentCount: number;
        };
    }[]) {

        return sortingPostList.sort((a, b) => {

            if (a.postCategory === 'notice' && b.postCategory !== 'notice') {
                return -1;
            };

            if (a.postCategory !== 'notice' && b.postCategory === 'notice') {
                return 1;
            }

            if (a.counts.dupCommentCount !== b.counts.dupCommentCount) {
                return b.counts.dupCommentCount - a.counts.dupCommentCount;
            }

            if (a.counts.commentCount !== b.counts.commentCount) {
                return b.counts.commentCount - a.counts.commentCount;
            }

            return 0;
        });
    };

    public showAnonymous(
        isAnonymous: number,
        targetUserId: number,
        viewerUserId: number,
        viewerRoleLevel: TRoleLevel
    ) {

        let showAnonymous = true;
        if (isAnonymous === 1) {

            if (targetUserId !== viewerUserId && viewerRoleLevel === 'joiner') {
                showAnonymous = false;
            }
        };
        
        return showAnonymous;

    };

}
