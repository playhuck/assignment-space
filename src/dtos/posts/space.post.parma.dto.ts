import { IsNotEmptyNumber } from "@common/decorators/cv.not.empty.decorator";
import { SpaceParamDto } from "@dtos/spaces/space.param.dto";
import { Post } from "@entities/post.entity";

export class SpacePostParamDto extends SpaceParamDto
    implements Pick<Post, 'postId'> {

    @IsNotEmptyNumber()
    postId!: number;

};