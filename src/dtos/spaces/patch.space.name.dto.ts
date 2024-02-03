import { IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { Space } from "@entities/space.entity";

export class PatchSpaceNameDto implements Pick<Space, 'spaceName'> {

    @IsNotEmptyString()
    spaceName!: string;

}