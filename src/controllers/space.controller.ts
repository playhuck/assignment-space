import { User, UserId } from '@common/decorators/user.decorator';
import { JwtUserGuard } from '@common/guards/jwt.user.guard';
import { SpaceRoleGuard } from '@common/guards/space.role.guard';
import { PostSpaceDto } from '@dtos/spaces/post.space.dto';
import { PostSpaceJoinDto } from '@dtos/spaces/post.space.join.dto';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { SpaceRoleParamDto } from '@dtos/spaces/space.role.param.dto';
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

        void await this.service.postSpaceJoin(
            user,
            param,
            body
        )
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
    async deleteSpace(
        @User() user: IUser,
        @Param() param: SpaceParamDto
    ) {

        void await this.service.deleteSpace(user, param);
    };

    /** 공간 역할 삭제 */
    @UseGuards(SpaceRoleGuard)
    @Delete('/admin/:spaceId/:spaceRoleId')
    async deleteSpaceRole(
        @Param() param: SpaceRoleParamDto
    ) {

        void await this.service.deleteSpaceRole(
            param
        )
    };

    @Get('/:spaceId')
    async getSpace() { };

    @Get('/:userId/list')
    async getMySpaceList() { };

}
