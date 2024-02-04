import {
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';

import { PostService } from '@services/post.service';

import { JwtUserGuard } from '@common/guards/jwt.user.guard';

@UseGuards(JwtUserGuard)
@Controller('space/:spaceId/post')
export class PostController {

    constructor(private readonly service: PostService){};

    @Post('/question')
    async postQuestion(){};

    @Post('/notice')
    async postNotice(){};

    @Patch('/')
    async postUpdate(){};

    @Delete('/')
    async postDelete(){};

    @Get('/list')
    async postList(){};

    @Get('/:postId')
    async getPost(){};

}
