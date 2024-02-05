import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Patch, 
    Query, 
    UseGuards
} from '@nestjs/common';

import { UserService } from '@services/user.service';

import { User } from '@common/decorators/user.decorator';

import { PageQueryDto } from '@dtos/page.query.dto';
import { PatchUserProfileImageDto } from '@dtos/users/patch.user.image.dto';
import { PatchUserNameDto } from '@dtos/users/patch.user.name.dto';
import { PatchUserPasswordDto } from '@dtos/users/patch.user.password.dto';
import { UserParamDto } from '@dtos/users/user.param.dto';

import { IUser } from '@models/interfaces/i.user';
import { JwtUserGuard } from '@common/guards/jwt.user.guard';

@UseGuards(JwtUserGuard)
@Controller('user')
export class UserController {

    constructor(private readonly service: UserService) { };

    @Get('/post-list')
    async getUserPostList(
        @User() user: IUser,
        @Query() query: PageQueryDto
    ) {

        const postList = await this.service.getUserPostList(
            user,
            query
        );

        return { postList };

    };

    @Get('/comment-list')
    async getUserCommentList(
        @User() user: IUser,
        @Query() query: PageQueryDto
    ) {

        const commentList = await this.service.getUserCommentList(
            user,
            query
        );

        return { commentList };

    };

    @Get('/:userId')
    async getProfile(
        @User() user: IUser,
        @Param() param: UserParamDto
    ) {

        const profile = user.userId === param.userId ?
            await this.service.getMyProfile(user) :
            await this.service.getOthersProfile(param);

        return { profile };

    };

    @Patch('/name')
    async updateUserName(
        @User() user: IUser,
        @Body() body: PatchUserNameDto
    ) {

        void await this.service.updateUserName(
            user,
            body
        );
    };

    @Patch('/password')
    async updateUserPassword(
        @User() user: IUser,
        @Body() body: PatchUserPasswordDto
    ) {

        void await this.service.updateUserPassword(
            user,
            body
        );
    };

    @Patch('/image')
    async updateUserProfileImage(
        @User() user: IUser,
        @Body() body: PatchUserProfileImageDto
    ) {

        const putPresignedUrl = await this.service.updateUserProfileImage(
            user,
            body
        );

        return { putPresignedUrl };

    };

}
