import { IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { User } from "@entities/user.entity";
import { TFileExtension } from "@models/types/t.common";

export class PatchUserProfileImageDto implements Pick<User, 'profileImage'> {

    @IsNotEmptyString()
    profileImage!: string;

}