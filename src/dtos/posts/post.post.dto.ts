import {
    IsNotEmptyArray,
    IsNotEmptyBoolean,
    IsNotEmptyNumber,
    IsNotEmptyString
} from "@common/decorators/cv.not.empty.decorator";
import { Post } from "@entities/post.entity";
import { IPostFileList } from "@models/interfaces/i.post";

export class PostPostDto 
    implements Pick<Post, 'postName' | 'postContents'>{

    @IsNotEmptyNumber()
    userId!: number;

    @IsNotEmptyNumber()
    spaceId!: number;

    @IsNotEmptyString()
    postName!: string;

    @IsNotEmptyString()
    postContents!: string;

    @IsNotEmptyArray()
    postFileList!: Array<IPostFileList>;

    @IsNotEmptyBoolean()
    isAnonymous!: boolean;

};