import { IsNotEmptyString } from "@common/decorators/cv.not.empty.decorator";
import { IRoleList } from "@models/interfaces/i.role";
import { TAdminRole, TRole, TRoleLevel } from "@models/types/t.role";
import { IsNotEmptyObject } from "class-validator";

export class PostSpaceRoleDto implements IRoleList {

    @IsNotEmptyString()
    defaultRole!: TRole;

    @IsNotEmptyString()
    roleLevel!: TRoleLevel;

    @IsNotEmptyString()
    roleName!: string;

    @IsNotEmptyObject()
    roles!: TAdminRole;
    
}