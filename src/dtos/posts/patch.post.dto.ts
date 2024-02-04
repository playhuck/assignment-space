import { 
    IsNotEmptyString, 
    IsNotEmptyArray, 
    IsNotEmptyBoolean 
} from "@common/decorators/cv.not.empty.decorator";
import { Post } from "@entities/post.entity";
import { IPostFileList } from "@models/interfaces/i.post";

export class PatchPostDto
    implements Pick<Post, 'postName' | 'postContents'>{

    @IsNotEmptyString()
    postName!: string;

    @IsNotEmptyString()
    postContents!: string;

    @IsNotEmptyArray()
    postFileList!: Array<IPostFileList>;

    @IsNotEmptyBoolean()
    isAnonymous!: boolean;

};