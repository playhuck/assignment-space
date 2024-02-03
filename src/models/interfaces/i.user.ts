import { User } from "@entities/user.entity";

interface IUser extends
    Pick<User, 'createdAt' | 'email' | 'firstName' | 'lastName' | 'profileImage' | 'userId'> {};

interface IUserId extends Pick<User, 'userId'> {};

export {
    IUser,
    IUserId
}