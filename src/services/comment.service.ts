import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { SpacePostParamDto } from '@dtos/posts/space.post.parma.dto';
import { ISpaceUserRelation } from '@models/interfaces/i.space.return';
import { DayjsProvider } from '@providers/dayjs.provider';
import { PostRepository } from '@repositories/post.repository';
import { SpaceRepository } from '@repositories/space.repository';
import { UserRepository } from '@repositories/user.repository';
import { DbUtil } from '@utils/db.util';
import { CommentRepository } from '@repositories/comment.repository';
import { PostCommentDto } from '@dtos/comments/post.comment.dto';
import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { CommentParamDto } from '@dtos/comments/comment.param.dto';
import { PatchCommentDto } from '@dtos/comments/patch.comment.dto';
import { IUser } from '@models/interfaces/i.user';
import { ReplyParamDto } from '@dtos/comments/reply.param.dto';
import { PostReplyDto } from '@dtos/comments/post.reply.dto';
import { PatchReplyDto } from '@dtos/comments/patch.reply.dto';

@Injectable()
export class CommentService {

    constructor(
        private readonly db: DbUtil,

        private readonly dayjs: DayjsProvider,

        private readonly spaceRepo: SpaceRepository,
        private readonly postRepo: PostRepository,
        private readonly userRepo: UserRepository,
        private readonly commentRepo: CommentRepository
    ) { }

    async postComment(
        user: IUser,
        param: SpacePostParamDto,
        body: PostCommentDto
    ) {

        void await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { postId } = param;
                const { comment, isAnonymous } = body;

                const createdAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                const insertComment = await this.commentRepo.insertComment(
                    entityManager,
                    userId,
                    postId,
                    comment,
                    isAnonymous,
                    createdAt
                );
                if (insertComment.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "댓글 작성 실패",
                        ECustomExceptionCode['AWS-RDS-EXCEPTION'],
                        500
                    )
                };

            }, {
            user,
            param,
            body
        })
    };

    async updateComment(
        user: IUser,
        param: CommentParamDto,
        body: PatchCommentDto
    ) {

        void await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { postId, commentId } = param;
                const { comment, isAnonymous } = body;

                const updatedAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                const updateComment = await this.commentRepo.updateComment(
                    entityManager,
                    userId,
                    postId,
                    commentId,
                    comment,
                    isAnonymous,
                    updatedAt
                );
                if (updateComment.affected !== 1) {
                    throw new CustomException(
                        "댓글 수정 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

            }, {
            user,
            param,
            body
        })
    };

    async deleteComment(
        userRelation: ISpaceUserRelation,
        param: CommentParamDto
    ) {

        void await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { userRelation, param } = args;
                const { userId, spaceRole } = userRelation;
                const {
                    roleLevel,
                    spaceChatAdminDelete
                } = spaceRole;
                const { postId, commentId } = param;

                const comment = await this.commentRepo.getCommentById(commentId);
                if (!comment) {
                    throw new CustomException(
                        "댓글을 찾을 수 없음",
                        ECustomExceptionCode['COMMENT-001'],
                        403
                    )
                };
                const {
                    userId: commentWriterUserId
                } = comment;
                if (commentWriterUserId !== userId) {

                    if (roleLevel === 'joiner' || spaceChatAdminDelete !== 1) {
                        throw new CustomException(
                            "[댓글]삭제 규칙 위반",
                            ECustomExceptionCode["ROLE-008"],
                            401
                        )
                    };
                };

                const deleteComment = await this.commentRepo.deleteComment(
                    entityManager,
                    postId,
                    commentId
                );
                if (!deleteComment?.deletedAt) {
                    throw new CustomException(
                        "댓글 삭제 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

            }, {
            userRelation,
            param
        })
    };

    async postReplyComment(
        user: IUser,
        param: CommentParamDto,
        body: PostReplyDto
    ) {

        await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { commentId } = param;
                const { commentReply, isAnonymous } = body;

                const createdAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                const insertReply = await this.commentRepo.insertReply(
                    entityManager,
                    userId,
                    commentId,
                    commentReply,
                    isAnonymous,
                    createdAt
                );
                if (insertReply.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "답글 작성 실패",
                        ECustomExceptionCode['AWS-RDS-EXCEPTION'],
                        500
                    )
                };


            }, {
            user,
            param,
            body
        })
    };

    async updateReplyComment(
        user: IUser,
        param: ReplyParamDto,
        body: PatchReplyDto
    ) {

        await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;

                const updatedAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                const insertReply = await this.commentRepo.updateReply(
                    entityManager,
                    userId,
                    param,
                    body,
                    updatedAt
                );
                if (insertReply.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "답글 수정 실패",
                        ECustomExceptionCode['AWS-RDS-EXCEPTION'],
                        500
                    )
                };


            }, {
            user,
            param,
            body
        })
    };

    async deleteReplyComment(
        userRelation: ISpaceUserRelation,
        param: ReplyParamDto
    ) {

        await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { userRelation, param } = args;
                const { userId, spaceRole } = userRelation;
                const { roleLevel, spaceChatAdminDelete } = spaceRole;
                const { replyId } = param;

                const reply = await this.commentRepo.getReplyById(replyId);
                if (!reply) {
                    throw new CustomException(
                        "답글을 찾을 수 없음",
                        ECustomExceptionCode["COMMENT-002"],
                        403
                    )
                };

                const {
                    userId: replyWriterUserId
                } = reply;
                if (replyWriterUserId !== userId) {

                    if (roleLevel === 'joiner' || spaceChatAdminDelete !== 1) {
                        throw new CustomException(
                            "[댓글]삭제 규칙 위반",
                            ECustomExceptionCode["ROLE-008"],
                            401
                        )
                    };
                };

                const deleteReply = await this.commentRepo.deleteReply(
                    entityManager,
                    replyId
                );
                if (deleteReply.affected !== 1) {
                    throw new CustomException(
                        "답글 삭제 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };


            }, {
            userRelation,
            param
        })
    };

};
