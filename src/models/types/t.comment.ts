import { Comment } from "@entities/post.comment.entity";
import { CommentReply } from "@entities/post.comment.reply.entity";

type TOnlyComment = Pick<Comment, 'comment' | 'commentId' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'postId' | 'userId'>;

type TOnlyReply = Pick<CommentReply, 'commentReply' | 'commentId' | 'createdAt' | 'deletedAt' | 'isAnonymous' | 'replyId' | 'updatedAt' | 'userId'>;

export {
    TOnlyComment,
    TOnlyReply
};