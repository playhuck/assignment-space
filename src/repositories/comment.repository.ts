import { Comment } from "@entities/post.comment.entity";
import { CommentReply } from "@entities/post.comment.reply.entity";
import { IOnlyComment } from "@models/interfaces/i.comment";
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

    }

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
    }

}