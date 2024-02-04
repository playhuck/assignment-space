import { PostSpaceDto } from "@dtos/spaces/post.space.dto";
import { faker } from "@faker-js/faker";
import { IRoleList } from "@models/interfaces/i.role";
import { TAdminRole, TRole, TRoleLevel } from "@models/types/t.role";

import { ADMIN, NOT_ADMIN_ROLE } from "@common/constants/role.constant";

export class SpaceDtoFixture {

    public async postSpace(
        spaceName: string
    ): Promise<PostSpaceDto> {

        const array = new Array(5).fill(0);
        
        const list = await Promise.all(array.map(async(val, i) => {

            const defaultRole: TRole = i === 0 ? 'admin' : i === 1 ? 'joiner' : 'custom';

            if (defaultRole !== 'custom') {
                return await this.postSpaceRoleList(
                    defaultRole,
                    defaultRole
                );
            } else {
                return await this.postSpaceRoleList(
                    defaultRole,
                    i === 2 ? 'admin' : 'joiner',
                    {
                        spaceChatAdminDelete: this.randomTinyIntValue,
                        spaceForcedExit: this.randomTinyIntValue,
                        spacePostAdminDelete: this.randomTinyIntValue,
                        spacePostNotice: this.randomTinyIntValue,
                        spaceRoleDelete: this.randomTinyIntValue
                    }
                )
            }
        }));

        return {
            spaceLogo: faker.datatype.string(5),
            spaceLogoExtension: 'file',
            spaceName,
            spaceOwnerRoleName: 'head',
            roleList: list
        }
    };

    public async postSpaceRoleList(
        defaultRole: TRole,
        roleLevel: TRoleLevel,
        roles?: TAdminRole
    ): Promise<IRoleList> {

        return {
            defaultRole,
            roleLevel,
            roleName: faker.datatype.string(5),
            roles: defaultRole === 'admin' ? ADMIN : defaultRole === 'joiner' ? NOT_ADMIN_ROLE as TAdminRole : roles as TAdminRole

        }
    };

    public async postSpaceQuestion(
        spaceName: string
    ) {

        const array = new Array(2).fill(0);

        const list = await Promise.all(array.map(async (val, i) => {

            if (i === 1) return await this.postSpaceRoleList('joiner', 'joiner');
            if (i === 0) return await this.postSpaceRoleList('admin', 'admin')
        }));

        return {
            spaceLogo: faker.datatype.string(5),
            spaceLogoExtension: 'file2',
            spaceName,
            spaceOwnerRoleName: 'head2',
            roleList: list
        }

    };

    public async postSpaceJoin(){
        return faker.datatype.string(8);
    }

    get randomTinyIntValue() {
        return Math.round(Math.random());
    }
}