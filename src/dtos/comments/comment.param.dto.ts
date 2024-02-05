import { IsNotEmptyNumber } from "@common/decorators/cv.not.empty.decorator";
import { SpacePostParamDto } from "@dtos/posts/space.post.parma.dto";

export class CommentParamDto extends SpacePostParamDto {

    @IsNotEmptyNumber()
    commentId!: number;
}