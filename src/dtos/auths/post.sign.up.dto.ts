import { IsEmail } from "class-validator";

import { IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { User } from "@entities/user.entity";

export class PostSignUpDto implements
    Pick<User, 'firstName' | 'lastName' | 'email' | 'password'> {

    @IsNotEmptyString()
    @IsEmail()
    email!: string;

    @IsNotEmptyString()
    password!: string;

    @IsNotEmptyString()
    passwordCheck!: string;

    @IsNotEmptyString()
    firstName!: string;

    @IsNotEmptyString()
    lastName!: string;
}