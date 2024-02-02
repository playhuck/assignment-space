import { UserId } from '@common/decorators/user.decorator';
import { JwtUserGuard } from '@common/guards/jwt.user.guard';
import { SpaceRoleGuard } from '@common/guards/space.role.guard';
import { PostSpaceDto } from '@dtos/spaces/post.space.dto';
import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { SpaceService } from '@services/space.service';

@UseGuards(JwtUserGuard)
@Controller('space')
export class SpaceController {

    constructor(private readonly service: SpaceService) { };

    @Post('/')
    async postSpace(
        @Body() body: PostSpaceDto,
        @UserId() userId: number
    ) {

        const getPresignedUrl = await this.service.postSpace(
            userId,
            body
        );

        return { getPresignedUrl };
    };

    @UseGuards(SpaceRoleGuard)
    @Patch('/owner/:spaceId')
    async updateSpace() { };

    @UseGuards(SpaceRoleGuard)
    @Delete('/owner/:spaceId')
    async deleteSpace() { };

    @Get('/:spaceId')
    async getSpace() { };

    @Get('/:userId/list')
    async getMySpaceList() { };

    @Post('/join')
    async postJoinSpace() { };

}
