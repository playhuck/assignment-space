import { IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { User } from "@entities/user.entity";

export class PatchUserNameDto implements Pick<User, 'firstName' | 'lastName'> {

    @IsNotEmptyString()
    firstName!: string;

    @IsNotEmptyString()
    lastName!: string;

}