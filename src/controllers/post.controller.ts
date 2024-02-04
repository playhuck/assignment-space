import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';

import { PostService } from '@services/post.service';

import { JwtUserGuard } from '@common/guards/jwt.user.guard';
import { User } from '@common/decorators/user.decorator';
import { IUser } from '@models/interfaces/i.user';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { PostPostDto } from '@dtos/posts/post.post.dto';

@UseGuards(JwtUserGuard)
@Controller('space/:spaceId/post')
export class PostController {

    constructor(private readonly service: PostService){};

    @Post('/question')
    async postQuestion(
        @User() user: IUser,
        @Param() param: SpaceParamDto,
        @Body() body: PostPostDto
    ){

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
    ){

        const putPresignedUrlList = await this.service.postNotice(
            user,
            param,
            body
        );

        return { putPresignedUrlList };
    };

    @Patch('/')
    async postUpdate(){};

    @Delete('/')
    async postDelete(){};

    @Get('/list')
    async postList(){};

    @Get('/:postId')
    async getPost(){};

}
