import { IUser } from "./i.user";

export interface ICustomRes extends Response {
    user: IUser;
    userId: number;
} 