import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";

import { User } from "@entities/user.entity";

@Injectable()
export class UserRepository extends Repository<User> {

    constructor(
        private readonly dataSource: DataSource
    ) {
        const baseRepository = dataSource.getRepository(User);
        super(baseRepository.target, baseRepository.manager, baseRepository.queryRunner)
    };

    async isEmail(email: string): Promise<boolean> {

        const result = await this.findOne({
            where: {
                email
            }
        });

        return result ? true : false;
    }
}