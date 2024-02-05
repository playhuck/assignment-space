import { IsNotEmptyBoolean, IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { Comment } from "@entities/post.comment.entity";

export class PostCommentDto implements Pick<Comment, 'comment'>{
    
    @IsNotEmptyString()
    comment!: string;

    @IsNotEmptyBoolean()
    isAnonymous!: boolean;
}