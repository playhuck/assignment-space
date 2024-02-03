import { IsNotEmptyNumber } from "@common/decorators/cv.not.empty.decorator";
import { User } from "@entities/user.entity";

export class UserParamDto implements
    Pick<User, 'userId'> {

    @IsNotEmptyNumber()
    userId!: number;

};