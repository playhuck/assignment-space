import { UserId } from '@common/decorators/user.decorator';
import { JwtRefreshGuard } from '@common/guards/jwt.refresh.guard';
import { PostSignInDto } from '@dtos/auths/post.sign.in.dto';
import { PostSignUpDto } from '@dtos/auths/post.sign.up.dto';
import { ICustomRes } from '@models/interfaces/i.res';
import {
    Body,
    Controller,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';

import { AuthService } from '@services/auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) { }

    @Post('/sign-up')
    async signUp(
        @Body() body: PostSignUpDto
    ) {

        void await this.service.signUp(body);

    };

    @Post('/sign-in')
    async signIn(
        @Body() body: PostSignInDto
    ) {

        const tokens = await this.service.signIn(body);

        return { tokens };
    };

    @UseGuards(JwtRefreshGuard)
    @Post('/access-token')
    async getAccessToken(
        @UserId() userId: number
    ) {

        const tokens = await this.service.getAccessToken(userId);

        return { tokens };
    };

    @UseGuards(JwtRefreshGuard)
    @Patch('/sign-out')
    async clearRefreshToken(
        @UserId() userId: number
    ) {
        
        void await this.service.clearRefreshToken(userId)
    }

}
