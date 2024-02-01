import { User } from "@entities/user.entity";

export interface ICustomRes extends Response {
    user: Pick<User, 'firstName' | 'lastName' | 'profileImage' | 'email' | 'userId'>;
    userId: Pick<User, 'userId'>;
} 