import { SpaceUserRole } from "@entities/space.user.role.entity";
import { TAdminRole, TRole, TRoleLevel } from "@models/types/t.role";

export interface IRoleList {

    defaultRole: TRole;
    roleName: string;
    roleLevel: TRoleLevel;
    roles: TAdminRole;

};