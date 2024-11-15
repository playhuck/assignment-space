import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';

import { CommentService } from '@services/comment.service';

import { User } from '@common/decorators/user.decorator';

import { JwtUserGuard } from '@common/guards/jwt.user.guard';
import { SpacePostGuard } from '@common/guards/space.post.guard';

import { CommentParamDto } from '@dtos/comments/comment.param.dto';
import { PatchCommentDto } from '@dtos/comments/patch.comment.dto';
import { PostCommentDto } from '@dtos/comments/post.comment.dto';
import { SpacePostParamDto } from '@dtos/posts/space.post.parma.dto';

import { ISpaceUserRelation } from '@models/interfaces/i.space.return';
import { IUser } from '@models/interfaces/i.user';
import { UserRelation } from '@common/decorators/user.relation.decorator';
import { PostReplyDto } from '@dtos/comments/post.reply.dto';
import { ReplyParamDto } from '@dtos/comments/reply.param.dto';
import { PatchReplyDto } from '@dtos/comments/patch.reply.dto';

@UseGuards(SpacePostGuard)
@UseGuards(JwtUserGuard)
@Controller('space/:spaceId/:postId/comment')
export class CommentController {

    constructor(private readonly service: CommentService) { }

    @Post('/')
    async postComment(
        @Param() param: SpacePostParamDto,
        @User() user: IUser,
        @Body() body: PostCommentDto
    ) {

        void await this.service.postComment(
            user,
            param,
            body
        )
    };

    @Patch('/:commentId')
    async updateComment(
        @User() user: IUser,
        @Param() param: CommentParamDto,
        @Body() body: PatchCommentDto
    ) { 

        void await this.service.updateComment(
            user,
            param,
            body
        )
    };

    @Delete('/:commentId')
    async deleteComment(
        @UserRelation() userRelation: ISpaceUserRelation,
        @Param() param : CommentParamDto 
    ) { 

        void await this.service.deleteComment(
            userRelation,
            param
        )
    };

    @Post('/:commentId')
    async postCommentReply(
        @User() user: IUser,
        @Param() param: CommentParamDto,
        @Body() body: PostReplyDto
    ){

        void await this.service.postReplyComment(
            user,
            param,
            body
        );
    };

    @Patch('/:commentId/:replyId')
    async updateCommentReply(
        @User() user: IUser,
        @Param() param: ReplyParamDto,
        @Body() body: PatchReplyDto
    ){

        void await this.service.updateReplyComment(
            user,
            param,
            body
        )
    };

    @Delete('/:commentId/:replyId')
    async deleteCommentReply(
        @UserRelation() userRelation: ISpaceUserRelation,
        @Param() param: ReplyParamDto
    ){

        void await this.service.deleteReplyComment(
            userRelation,
            param
        );
        
    };

}
