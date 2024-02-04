import {
    IsNotEmptyArray,
    IsNotEmptyBoolean,
    IsNotEmptyNumber,
    IsNotEmptyString
} from "@common/decorators/cv.not.empty.decorator";
import { Post } from "@entities/post.entity";
import { IPostFileList } from "@models/interfaces/i.post";
import { TPostCategory } from "@models/types/t.post";

export class PostPostDto 
    implements Pick<Post, 'postName' | 'postContents' | 'postCategory'>{

    @IsNotEmptyString()
    postName!: string;

    @IsNotEmptyString()
    postContents!: string;

    @IsNotEmptyArray()
    postFileList!: Array<IPostFileList>;

    @IsNotEmptyBoolean()
    isAnonymous!: boolean;

    @IsNotEmptyString()
    postCategory!: TPostCategory;

};