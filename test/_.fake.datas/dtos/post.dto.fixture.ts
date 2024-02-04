import { PostSpaceDto } from "@dtos/spaces/post.space.dto";
import { faker } from "@faker-js/faker";
import { IRoleList } from "@models/interfaces/i.role";
import { TAdminRole, TRole, TRoleLevel } from "@models/types/t.role";

import { ADMIN, NOT_ADMIN_ROLE } from "@common/constants/role.constant";
import { PostFile } from "@entities/post.file.entity";
import { IPostFileList } from "@models/interfaces/i.post";
import { PostPostDto } from "@dtos/posts/post.post.dto";
import { TPostCategory } from "@models/types/t.post";

export class PostDtoFixture {

    public async postDto(
        postName: string,
        isAnonymous: boolean,
        postCategory: TPostCategory
    ): Promise<PostPostDto> {

        return {
            postContents: this.generatePostContents,
            postName,
            postFileList: [
                await this.file(1)
            ],
            isAnonymous,
            postCategory
        }
    };

    public async file(fileId: number): Promise<IPostFileList>{

        return {
            fileExtension: 'image',
            fileId,
            fileName: `${this.generateFileName}.png`
            
        }
    };

    get generatePostContents(){
        return faker.datatype.string(20)
    };

    get generateFileName(){
        return faker.datatype.string(7)
    }
}