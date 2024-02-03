import { SpaceRole } from "@entities/space.role.entity";

export type TDefaultRole = Pick<SpaceRole,
    'spaceDelete' | "spaceOwnerAssign" | 'spaceRoleUpdate' | 'spaceUpdate'> | TAdminRole;

export type TAdminRole = Pick<SpaceRole,
    'spaceChatAdminDelete' | 'spacePostAdminDelete' | 'spacePostNotice' | 'spaceRoleDelete' | 'spaceForcedExit'>;

export type TRole = TRoleLevel | 'custom';

export type TRoleLevel = 'owner' | 'admin' | 'joiner';