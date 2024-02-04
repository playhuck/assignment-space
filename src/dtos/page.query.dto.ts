import { IsNotEmptyNumber, IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { TSortCreatedAt } from "@models/types/t.common";

export class PageQueryDto {

    @IsNotEmptyNumber()
    page!: number;

    @IsNotEmptyNumber()
    pageCount!: number;

    @IsNotEmptyString()
    sortCraetedAt!: TSortCreatedAt
}