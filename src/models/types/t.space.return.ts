import { Space } from "@entities/space.entity";
import { SpaceRoleCode } from "@entities/space.role.code.entity";
import { SpaceRole } from "@entities/space.role.entity";
import { SpaceUserRole } from "@entities/space.user.role.entity";

type TOnlySpace = Pick<Space, 'createdAt' | 'deletedAt' | 'spaceLogo' | 'spaceId' | 'spaceName' | 'userId'>;
type TOnlySpaceRole = Pick<SpaceRole, 
'createdAt' | 'deletedAt' | 'roleLevel' | 'roleName' | 'spaceId' | 'spaceRoleId' |
'spaceChatAdminDelete' | 'spaceDelete' | 'spaceForcedExit' | 'spaceOwnerAssign' | 'spacePostAdminDelete' | 'spacePostNotice' |
'spaceRoleCodes' | 'spaceRoleDelete' | 'spaceRoleUpdate' | 'spaceUpdate'
>;
type TOnlySpaceUserRole = Pick<SpaceUserRole, 'createdAt' | 'deletedAt' | 'spaceId' | 'spaceRoleId' | 'spaceUserRoleId' | 'userId'>; 
type TOnlySpaceRoleCode = Pick<SpaceRoleCode, 'code' | 'createdAt' | 'deletedAt' | 'spaceId' | 'spaceRoleCodeId' | 'spaceRoleId'>;

export {
    TOnlySpace,
    TOnlySpaceRole,
    TOnlySpaceRoleCode,
    TOnlySpaceUserRole
}