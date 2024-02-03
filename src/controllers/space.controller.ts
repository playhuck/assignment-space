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

import { SpaceService } from '@services/space.service';

import { User } from '@common/decorators/user.decorator';

import { JwtUserGuard } from '@common/guards/jwt.user.guard';
import { SpaceRoleGuard } from '@common/guards/space.role.guard';

import { PatchSpaceLogoDto } from '@dtos/spaces/patch.space.logo.dto';
import { PatchSpaceNameDto } from '@dtos/spaces/patch.space.name.dto';
import { PostSpaceJoinDto } from '@dtos/spaces/post.space.join.dto';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { SpaceRoleParamDto } from '@dtos/spaces/space.role.param.dto';

import { IUser } from '@models/interfaces/i.user';
import { PatchSpaceRoleDto } from '@dtos/spaces/patch.space.role.dto';

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

    /** 공간 참여 */
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

    /** 공간 이름 수정 */
    @UseGuards(SpaceRoleGuard)
    @Patch('/owner/:spaceId/name')
    async updateSpaceName(
        @Body() body: PatchSpaceNameDto,
        @Param() param: SpaceParamDto
    ) { 

        void await this.service.updateSpaceName(
            param,
            body
        );

    };

    /** 공간 로고 수정 */
    @UseGuards(SpaceRoleGuard)
    @Patch('/owner/:spaceId/logo')
    async updateSpaceLogo(
        @User() user: IUser,
        @Body() body: PatchSpaceLogoDto,
        @Param() param: SpaceParamDto
    ) { 

        const getPresignedUrl = await this.service.updateSpaceLogo(
            user,
            param,
            body
        );

        return { getPresignedUrl };

    };

    /** 공간 구성원 역할 수정 */
    @UseGuards(SpaceRoleGuard)
    @Patch('/owner/:spaceId/role')
    async updateSpaceRole(
        @Param() param: SpaceParamDto,
        @Body() body: PatchSpaceRoleDto
    ) {

        await this.service.updateSpaceRole(
            param,
            body
        );

    };

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
    async getSpace(
        @Param() param: SpaceParamDto
    ) {

        const space = await this.service.getSpace(param);

        return { space };
    };

    @Get('/:userId/list')
    async getMySpaceList(
        @User() user: IUser
    ) {

        const getMySpaceList = await this.service.getMySpaceList(user);

        return { getMySpaceList };
    };

}
