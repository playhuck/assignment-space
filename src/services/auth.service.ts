import { PostSignInDto } from '@dtos/auths/post.sign.in.dto';
import { PostSignUpDto } from '@dtos/auths/post.sign.up.dto';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) userRepo: Repository<User>
    ){}

    async signUp (
        body: PostSignUpDto
    ) {};

    async signIn (
        body: PostSignInDto
    ) {};
}
