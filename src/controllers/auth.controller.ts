import { Controller, Post } from '@nestjs/common';
import { AuthService } from '@services/auth.service';

@Controller('auth')
export class AuthController {

    constructor( private readonly service: AuthService ){}

    @Post('/sign-up')
    async signUp(){};

    @Post('/sign-in')
    async signIn(){};
}
