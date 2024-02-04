import { UserRelation } from '@common/decorators/user.relation.decorator';
import { SpacePostParamDto } from '@dtos/posts/space.post.parma.dto';
import { ISpaceUserRoleRelationSpaceAndSpaceRole } from '@models/interfaces/i.space.return';
import { Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CommentService } from '@services/comment.service';

@Controller('space/:spaceId/:postId/comment')
export class CommentController {

    constructor(private readonly service: CommentService) { }

    @Post('/')
    async postComment(
        @Param() param: SpacePostParamDto,
        @UserRelation() userRelation: ISpaceUserRoleRelationSpaceAndSpaceRole
    ) {

        void await this.service.postComment(
            userRelation,
            param
        )
    };

    @Patch('/:commentId')
    async updateComment() { };

    @Delete('/:commentId')
    async deleteComment() { };
}
