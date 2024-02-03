import { User } from "@entities/user.entity";

interface IUser extends
    Pick<User, 'createdAt' | 'email' | 'firstName' | 'lastName' | 'profileImage' | 'userId'> {};

export {
    IUser
}