import { IsNotEmptyNumber } from "@common/decorators/cv.not.empty.decorator";
import { Space } from "@entities/space.entity";

export class SpaceParamDto implements
    Pick<Space, 'spaceId'> {

    @IsNotEmptyNumber()
    spaceId!: number;

};