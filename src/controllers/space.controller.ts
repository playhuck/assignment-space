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
import { PageQueryDto } from '@dtos/page.query.dto';
import { DeleteSpaceUserRoleDto } from '@dtos/spaces/delete.space.user.role.dto';
import { PatchAlarmSettingsDto } from '@dtos/spaces/patch.alarm.settings.dto';
import { PostSpaceDto } from '@dtos/spaces/post.space.dto';
import { PostSpaceRoleDto } from '@dtos/spaces/post.space.role.dto';

@UseGuards(JwtUserGuard)
@Controller('space')
export class SpaceController {

    constructor(private readonly service: SpaceService) { };

    /** 공간 생성 */
    @Post('/')
    async postSpace(
        @Body() body: PostSpaceDto,
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
    };

    @Post('/owner/:spaceId/role')
    async postSpaceRole(
        @User() user: IUser,
        @Param() param: SpaceParamDto,
        @Body() body: PostSpaceRoleDto
    ){

        void await this.service.postSpaceRole(
            user,
            param,
            body
        )
    };

    /** 공간 알람 옵션 수정 */
    @Patch('/:spaceId/alarm/settings')
    async updateAlarmSettings(
        @User() user: IUser,
        @Param() param: SpaceParamDto,
        @Body() body: PatchAlarmSettingsDto
    ) {

        await this.service.updateAlarmSettings(
            user,
            param,
            body
        );

    };

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

    /** 공간 유저 강제 퇴장 */
    @UseGuards(SpaceRoleGuard)
    @Delete('/admin/:spaceId/user-role')
    async deleteSpaceUserRole(
        @User() user: IUser,
        @Body() body: DeleteSpaceUserRoleDto,
        @Param() param: SpaceParamDto
    ) {

        void await this.service.deleteSpaceUserRole(user, body, param);

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

    /** 특정 공간 정보 */
    @Get('/:spaceId')
    async getSpace(
        @Param() param: SpaceParamDto
    ) {

        const space = await this.service.getSpace(param);

        return { space };
    };

    /** 나의 전체 공간 참여 리스트 */
    @Get('/:userId/list')
    async getMySpaceList(
        @User() user: IUser,
        @Query() query: PageQueryDto
    ) {

        const getMySpaceList = await this.service.getMySpaceList(user, query);

        return { getMySpaceList };
    };

}
