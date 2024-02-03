import { IsNotEmptyArray, IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { IsOptionalString } from "@common/decorators/cv.optional.decorator";
import { Space } from "@entities/space.entity";
import { IRoleList } from "@models/interfaces/i.role";
import { TFileExtension } from "@models/types/t.common";

export class PostSpaceJoinDto {

    @IsNotEmptyString()
    joinCode!: string;

};