import { IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { User } from "@entities/user.entity";

export class PostSignInDto implements
    Pick<User, 'email' | 'password'> {

    @IsNotEmptyString()
    email!: string;

    @IsNotEmptyString()
    password!: string;

}