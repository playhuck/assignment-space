import { Space } from "@entities/space.entity";
import { SpaceRole } from "@entities/space.role.entity";
import { SpaceUserRole } from "@entities/space.user.role.entity";
import { TRoleLevel } from "@models/types/t.role";
import { TOnlySpace, TOnlySpaceRole, TOnlySpaceRoleCode, TOnlySpaceUserRole } from "@models/types/t.space.return";

interface IOnlySpace extends TOnlySpace { };

interface IOnlySpaceRole extends TOnlySpaceRole { };

interface IOnlySpaceUserRole extends TOnlySpaceUserRole { };

interface ISpaceUserRoleRelationSpaceRole extends TOnlySpaceUserRole {
    spaceRole: SpaceRole
};

interface ISpaceUserRelation extends TOnlySpaceUserRole {
    spaceRole: SpaceRole;
    space: Space
};

interface IOnlySpaceRoleCode extends TOnlySpaceRoleCode { };

interface ISpaceRelation {
    spaceId: number;
    userId: number;
    spaceName: string;
    spaceLogo: string;
    spaceRoles: Array<{
        spaceRoleId: number
        roleName: string;
        roleLevel: TRoleLevel;
    }>
    spaceUserRoles: Array<{
        spaceRoleId: number
        spaceUserRoleId: number
        userId: number
    }>;
};

export {
    IOnlySpace,
    IOnlySpaceRole,
    IOnlySpaceRoleCode,
    IOnlySpaceUserRole,
    ISpaceUserRoleRelationSpaceRole,
    ISpaceUserRelation,

    ISpaceRelation
}