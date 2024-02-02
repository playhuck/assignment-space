import { TAdminRole, TDefaultRole } from "@models/types/t.role";

const OWNER_ROLE: TDefaultRole = {
    spaceOwnerAssign: 1,
    spaceChatAdminDelete: 1,
    spaceDelete: 1,
    spaceForcedExit: 1,
    spacePostAdminDelete: 1,
    spacePostNotice: 1,
    spaceRoleDelete: 1,
    spaceRoleUpdate: 1,
    spaceUpdate: 1
};

const NOT_OWNER_ROLE = {
    ...Object.fromEntries(Object.entries(OWNER_ROLE).map(([key, _]) => [key, 0])),
};

const ADMIN_ROLE: TAdminRole = {
    spaceChatAdminDelete: 1,
    spaceForcedExit: 1,
    spacePostAdminDelete: 1,
    spacePostNotice: 1,
    spaceRoleDelete: 1
};

const NOT_ADMIN_ROLE = {
    ...Object.fromEntries(Object.entries(ADMIN_ROLE).map(([key, _]) => [key, 0])),
};

export const OWNER = {
    ...OWNER_ROLE,
    ...ADMIN_ROLE
};

export const ADMIN = {
    ...NOT_OWNER_ROLE,
    ...ADMIN_ROLE
};

export const JOINER = {
    ...NOT_OWNER_ROLE,
    ...NOT_ADMIN_ROLE
};