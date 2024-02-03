import { TAdminRole, TDefaultRole } from "@models/types/t.role";

const OWNER_ROLE: TDefaultRole = {
    spaceOwnerAssign: 1,
    spaceDelete: 1,
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
} as TAdminRole;

const OWNER = {
    ...OWNER_ROLE,
    ...ADMIN_ROLE
};

const ADMIN = {
    ...NOT_OWNER_ROLE,
    ...ADMIN_ROLE
};

const JOINER = {
    ...NOT_OWNER_ROLE,
    ...NOT_ADMIN_ROLE
};

export {
    OWNER_ROLE,
    OWNER,
    NOT_ADMIN_ROLE,
    NOT_OWNER_ROLE,
    ADMIN,
    ADMIN_ROLE,
    JOINER
}