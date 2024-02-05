import { IsNotEmptyBoolean, IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { Comment } from "@entities/post.comment.entity";
import { CommentReply } from "@entities/post.comment.reply.entity";

export class PostReplyDto implements Pick<CommentReply, 'commentReply'>{
    
    @IsNotEmptyString()
    commentReply!: string;

    @IsNotEmptyBoolean()
    isAnonymous!: boolean;
}