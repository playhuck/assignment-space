import { Injectable } from "@nestjs/common";
import { Repository, DataSource, EntityManager } from "typeorm";

import { User } from "@entities/user.entity";
import { PostSignUpDto } from "@dtos/auths/post.sign.up.dto";

@Injectable()
export class UserRepository extends Repository<User> {

    constructor(
        private readonly dataSource: DataSource
    ) {
        const baseRepository = dataSource.getRepository(User);
        super(baseRepository.target, baseRepository.manager, baseRepository.queryRunner)
    };

    async getAuthentificData(email: string) {

        const result = await this.findOne({
            where: {
                email
            },
            select: {
                email: true,
                password: true,
                userId: true
            }
        });

        return result;
    };

    async insertUserEntity(
        entityManager: EntityManager,
        body: PostSignUpDto,
        hashedPassword: string
        ) {

        const {
            email,
            firstName,
            lastName
        } = body;

        const insert = await entityManager.insert(User, {
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        return insert

    }
}