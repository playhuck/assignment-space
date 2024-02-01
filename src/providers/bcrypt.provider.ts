import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import bcrypt from "bcrypt";

@Injectable()
export class BcryptProvider {

    private readonly SALT: number;

    constructor(private readonly config: ConfigService) {
        this.SALT = this.config.get<number>('SALT')!;

    }

    public async hashPassword(inputPassword: string): Promise<string> {
        try {

            const hashedPassword = await bcrypt.hash(inputPassword, +this.SALT);

            return hashedPassword;

        } catch (err) {

            throw err;
        }
    }

    public async comparedPassword(inputPassword: string, existPassword: string): Promise<boolean> {
        try {

            return await bcrypt.compare(inputPassword, existPassword);

        } catch (err) {
            throw err;
        }
    };

    public matchedPassword(password: string, passwordCheck: string): boolean {

        return password !== passwordCheck ? false : true

    };

    public async matchedPwdRegEx(
        staffPassword: string,
        staffPasswordCheck: string
    ) {

        const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

        const matchedRegexPwd = passwordRegex.test(staffPassword);
        const matchedRegexPwdCheck = passwordRegex.test(staffPasswordCheck);

        return {
            matchedRegexPwd,
            matchedRegexPwdCheck
        };
    };

}