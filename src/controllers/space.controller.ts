import { User, UserId } from '@common/decorators/user.decorator';
import { JwtUserGuard } from '@common/guards/jwt.user.guard';
import { SpaceRoleGuard } from '@common/guards/space.role.guard';
import { PostSpaceDto } from '@dtos/spaces/post.space.dto';
import { PostSpaceJoinDto } from '@dtos/spaces/post.space.join.dto';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { IUser } from '@models/interfaces/i.user';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SpaceService } from '@services/space.service';

@UseGuards(JwtUserGuard)
@Controller('space')
export class SpaceController {

    constructor(private readonly service: SpaceService) { };

    /** 공간 생성 */
    @Post('/')
    async postSpace(
        @Body() body: any,
        @User() user: IUser
    ) {

        const getPresignedUrl = await this.service.postSpace(
            user,
            body
        );

        return { getPresignedUrl };
    };

    @Post('/:spaceId/join')
    async postSpaceJoin(
        @User() user: IUser,
        @Param() param: SpaceParamDto,
        @Body() body: PostSpaceJoinDto
    ){

    }

    /** 공간 수정 */
    @UseGuards(SpaceRoleGuard)
    @Patch('/owner/:spaceId')
    async updateSpace() { };

    /** 소유권 할당 */
    @UseGuards(SpaceRoleGuard)
    @Patch('/owner/:spaceId/owner-assgin')
    async updateSpaceOwner() { };

    /** 공간 삭제 */
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
