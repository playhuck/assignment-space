import { PostSignInDto } from '@dtos/auths/post.sign.in.dto';
import { PostSignUpDto } from '@dtos/auths/post.sign.up.dto';
import { 
    Body, 
    Controller, 
    Post 
} from '@nestjs/common';

import { AuthService } from '@services/auth.service';

@Controller('auth')
export class AuthController {

    constructor( private readonly service: AuthService ){}

    @Post('/sign-up')
    async signUp(
        @Body() body: PostSignUpDto
    ){

        void await this.service.signUp(body);

    };

    @Post('/sign-in')
    async signIn(
        @Body() body: PostSignInDto
    ){

        const tokens = await this.service.signIn(body);

        return { tokens };
    };
    
}
