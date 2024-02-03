import { IsNotEmptyNumber } from "@common/decorators/cv.not.empty.decorator";
import { SpaceRole } from "@entities/space.role.entity";
import { SpaceParamDto } from "./space.param.dto";

export class SpaceRoleParamDto
    extends SpaceParamDto
    implements Pick<SpaceRole, 'spaceRoleId'> {

    @IsNotEmptyNumber()
    spaceRoleId!: number;

};