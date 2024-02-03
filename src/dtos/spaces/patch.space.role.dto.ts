import { IsNotEmptyNumber, IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { UserParamDto } from "@dtos/users/user.param.dto";
import { SpaceRole } from "@entities/space.role.entity";
import { User } from "@entities/user.entity";

export class PatchSpaceRoleDto
    extends UserParamDto
    implements
    Pick<SpaceRole, 'spaceRoleId'> {

    @IsNotEmptyNumber()
    spaceRoleId!: number;
}