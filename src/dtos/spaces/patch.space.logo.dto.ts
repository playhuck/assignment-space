import { IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { Space } from "@entities/space.entity";
import { TFileExtension } from "@models/types/t.common";

export class PatchSpaceLogoDto implements Pick<Space, 'spaceLogo'> {

    @IsNotEmptyString()
    spaceLogo!: string;

    @IsNotEmptyString()
    spaceLogoExtension!: TFileExtension;

};