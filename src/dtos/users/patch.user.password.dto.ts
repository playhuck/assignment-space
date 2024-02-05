import { IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { User } from "@entities/user.entity";

export class PatchUserPasswordDto {

    @IsNotEmptyString()
    originPassword!: string;

    @IsNotEmptyString()
    newPassword!: string;

    @IsNotEmptyString()
    newPasswordCheck!: string;

}