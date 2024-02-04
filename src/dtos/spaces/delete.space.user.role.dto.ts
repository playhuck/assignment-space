import { IsNotEmptyNumber } from "@common/decorators/cv.not.empty.decorator";

export class DeleteSpaceUserRoleDto {

    @IsNotEmptyNumber()
    spaceUserRoleId!: number;

    @IsNotEmptyNumber()
    userId!: number;
}