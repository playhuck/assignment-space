import {
    IsNotEmptyArray,
    IsNotEmptyNumber,
    IsNotEmptyString
} from "@common/decorators/cv.not.empty.decorator";
import { IPostFileList } from "@models/interfaces/i.post";

export class PostPostDto {

    @IsNotEmptyNumber()
    userId!: number;

    @IsNotEmptyNumber()
    spaceId!: number;

    @IsNotEmptyString()
    postName!: string;

    @IsNotEmptyString()
    postContents!: string;

    @IsNotEmptyArray()
    postFileList!: Array<IPostFileList>
};