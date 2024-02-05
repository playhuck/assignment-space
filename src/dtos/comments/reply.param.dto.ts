import { IsNotEmptyNumber } from "@common/decorators/cv.not.empty.decorator";
import { CommentParamDto } from "./comment.param.dto";

export class ReplyParamDto extends CommentParamDto {

    @IsNotEmptyNumber()
    replyId!: number;
}