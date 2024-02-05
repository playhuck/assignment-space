import { PatchReplyDto } from "@dtos/comments/patch.reply.dto";
import { ReplyParamDto } from "@dtos/comments/reply.param.dto";
import { Comment } from "@entities/post.comment.entity";
import { CommentReply } from "@entities/post.comment.reply.entity";
import { IOnlyComment, IOnlyReply } from "@models/interfaces/i.comment";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class CommentRepository {

    constructor(
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(CommentReply) private replyRepo: Repository<CommentReply>
    ) {
    };

    async getCommentById<T extends IOnlyComment>(
        commentId: number
    ): Promise<T | null> {

        const comment = await this.commentRepo
            .createQueryBuilder()
            .select([
                'post_comment_id AS commentId',
                'post_id AS postId',
                'user_id AS userId',
                'post_comment AS comment',
                'created_at AS createdAt',
                'updated_at AS updatedAt',
                'deleted_at AS deletedAt'
            ])
            .where(`post_comment_id =:commentId`, { commentId })
            .getRawOne();

        return comment as T | null;

    };

    async getCommentByPostId(
        postId: number
    ){

        const commentList = await this.commentRepo.find({
            where: {
                postId
            }
        });

        return commentList;
    }

    async getCommentCountByPostId(
        postId: number
    ): Promise<{
        commentCount: number,
        replyCount: number,
        dupCommentCount: number,
        dupReplyCount: number
    }>{

        const commentList = await this.getCommentByPostId(postId);
        if(commentList.length === 0){
            return {
                commentCount: 0,
                replyCount: 0,
                dupCommentCount: 0,
                dupReplyCount: 0
            }
        };

        return 'd' as any

    };

    async insertComment(
        entityManager: EntityManager,
        userId: number,
        postId: number,
        comment: string,
        isAnonymous: boolean,
        createdAt: string
    ) {

        const insertComment = await entityManager.insert(Comment, {
            userId,
            postId,
            comment,
            isAnonymous: isAnonymous ? 1 : 0,
            createdAt
        });

        return insertComment;

    };

    async updateComment(
        entityManager: EntityManager,
        userId: number,
        postId: number,
        commentId: number,
        comment: string,
        isAnonymous: boolean,
        updatedAt: string

    ) {

        const updateComment = await entityManager.update(Comment, {
            userId,
            postId,
            commentId
        }, {
            comment,
            isAnonymous: isAnonymous ? 1 : 0,
            updatedAt
        });

        return updateComment;

    };

    async deleteComment(
        entityManager: EntityManager,
        postId: number,
        commentId: number
    ) {

        const deleteCommentRelation = await entityManager.findOne(Comment, {
            where: {
                postId,
                commentId
            },
            relations: ['commentReplys']
        });

        const deleteComment = await entityManager.softRemove(Comment, deleteCommentRelation!);

        return deleteComment;
    };

    async getReplyById<T extends IOnlyReply>(
        replyId: number
    ): Promise<T | null> {

        const reply = await this.replyRepo
            .createQueryBuilder()
            .select([
                'post_comment_reply_id AS replyId',
                'comment_id AS commentId',
                'user_id AS userId',
                'post_comment_reply AS commentReply',
                'updated_at AS updatedAt',
                'created_at AS createdAt',
                'deleted_at AS deletedAt'
            ])
            .where(`post_comment_reply_id =:replyId`, { replyId })
            .getRawOne();

        return reply as T | null;
    };

    async getReplyListByCommentId(
        commentId: number
    ) {

        const replyList = await this.replyRepo.find({
            where: {
                commentId
            }
        });

        return replyList;
    }

    async insertReply(
        entityManager: EntityManager,
        userId: number,
        commentId: number,
        commentReply: string,
        isAnonymous: boolean,
        createdAt: string
    ){

        const insertReply = await entityManager.insert(CommentReply, {
            userId,
            commentId,
            commentReply,
            isAnonymous: isAnonymous ? 1 : 0,
            createdAt
        });

        return insertReply;

    };

    async updateReply(
        entityManager: EntityManager,
        userId: number,
        param: ReplyParamDto,
        body: PatchReplyDto,
        updatedAt: string
    ) {

        const { commentId, replyId } = param;
        const { commentReply, isAnonymous } = body;

        const updateReply = await entityManager.update(CommentReply, {
            userId,
            commentId,
            replyId
        }, {
            commentReply,
            isAnonymous: isAnonymous ? 1 : 0,
            updatedAt
        });

        return updateReply;

    };

    async deleteReply(
        entityManager: EntityManager,
        replyId: number
    ){

        const deleteReply = await entityManager.softDelete(CommentReply, {
            replyId
        });

        return deleteReply;
    }

}