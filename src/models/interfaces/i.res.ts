import { IUser, IUserId } from "./i.user";

export interface ICustomRes extends Response {
    user: IUser;
    userId: IUserId;
} 