import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';

import { PostService } from '@services/post.service';

import { JwtUserGuard } from '@common/guards/jwt.user.guard';
import { User } from '@common/decorators/user.decorator';
import { IUser } from '@models/interfaces/i.user';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { PostPostDto } from '@dtos/posts/post.post.dto';
import { SpacePostParamDto } from '@dtos/posts/space.post.parma.dto';
import { PatchPostDto } from '@dtos/posts/patch.post.dto';
import { SpacePostGuard } from '@common/guards/space.post.guard';
import { UserRelation } from '@common/decorators/user.relation.decorator';
import { ISpaceUserRoleRelationSpaceAndSpaceRole } from '@models/interfaces/i.space.return';
import { PageQueryDto } from '@dtos/page.query.dto';

@UseGuards(SpacePostGuard)
@UseGuards(JwtUserGuard)
@Controller('space/:spaceId/post')
export class PostController {

    constructor(private readonly service: PostService) { };

    @Post('/question')
    async postQuestion(
        @User() user: IUser,
        @Param() param: SpaceParamDto,
        @Body() body: PostPostDto
    ) {

        const putPresignedUrlList = await this.service.postQuestion(
            user,
            param,
            body
        );

        return { putPresignedUrlList };
    };

    @Post('/notice')
    async postNotice(
        @User() user: IUser,
        @Param() param: SpaceParamDto,
        @Body() body: PostPostDto
    ) {

        const putPresignedUrlList = await this.service.postNotice(
            user,
            param,
            body
        );

        return { putPresignedUrlList };
    };

    @Patch('/:postId/question')
    async updateQuestion(
        @User() user: IUser,
        @Param() param: SpacePostParamDto,
        @Body() body: PatchPostDto
    ) {

        const putPresignedUrlList = await this.service.updateQuestion(
            user,
            param,
            body
        );

        return { putPresignedUrlList };

    };

    @Patch('/:postId/notice')
    async updateNotice(
        @User() user: IUser,
        @Param() param: SpacePostParamDto,
        @Body() body: PatchPostDto
    ) {

        const putPresignedUrlList = await this.service.updateNotice(
            user,
            param,
            body
        );

        return { putPresignedUrlList };

    };

    @Delete('/:postId')
    async postDelete(
        @UserRelation() userSpaceRelation: ISpaceUserRoleRelationSpaceAndSpaceRole,
        @Param() param: SpacePostParamDto
    ) {

        await this.service.postDelete(
            userSpaceRelation,
            param
        );
    };

    @Get('/list')
    async postList(
        @UserRelation() userSpaceRelation: ISpaceUserRoleRelationSpaceAndSpaceRole,
        @Param() param: SpaceParamDto,
        @Query() query: PageQueryDto
    ) {

        const postList = await this.service.postList(
            userSpaceRelation,
            param,
            query
        );

        return { postList };
    };

    @Get('/:postId')
    async getPost(
        @UserRelation() userRelation: ISpaceUserRoleRelationSpaceAndSpaceRole,
        @Param() param: SpacePostParamDto
    ) {

        const post = await this.service.getPost(
            userRelation,
            param
        );

        return { post };
    };

}
