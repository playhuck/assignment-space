import { TRole, TDefaultRole } from "@models/types/t.role";

export interface IRoleList {

    defaultRole: TRole;
    roleName: string;
    role?: TDefaultRole;

};