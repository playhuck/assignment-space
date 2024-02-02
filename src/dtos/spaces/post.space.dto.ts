import { IsNotEmptyArray, IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { Space } from "@entities/space.entity";
import { IRoleList } from "@models/interfaces/i.role";

export class PostSpaceDto implements
    Pick<Space, 'spaceName' | 'spaceLogo'>{

    @IsNotEmptyString()
    spaceName!: string;

    @IsNotEmptyString()
    spaceLogo!: string;

    @IsNotEmptyArray()
    roleList!: Array<IRoleList>

};