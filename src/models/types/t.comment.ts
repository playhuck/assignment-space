import { Comment } from "@entities/post.comment.entity";

type TOnlyComment = Pick<Comment, 'comment' | 'commentId' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'postId' | 'userId'>;

export {
    TOnlyComment
};