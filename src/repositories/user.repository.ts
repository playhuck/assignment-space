import { Injectable } from "@nestjs/common";
import { Repository, DataSource, EntityManager } from "typeorm";

import { User } from "@entities/user.entity";
import { PostSignUpDto } from "@dtos/auths/post.sign.up.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { IUser } from "@models/interfaces/i.user";

@Injectable()
export class UserRepository {

    constructor(
        @InjectRepository(User) private userRepo: Repository<User>
    ) {
    };

    async getUserById(
        userId: number
    ): Promise<IUser | null> {

        const user = await this.userRepo.findOne({
            where: {
                userId
            },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                userId: true
            }
        });

        return user;
    }

    async getAuthentificData(email: string) {

        const user = await this.userRepo
            .createQueryBuilder()
            .select([
                'user_id as userId',
                'email',
                'password',
                'refresh_token as refreshToken'
            ]).
            where(`email =:email`, { email })
            .getRawOne();

        return user;
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

    };

    async updateUserRefresh(
        entityManager: EntityManager,
        userId: number,
        refreshToken: string
    ) {

        const update = await entityManager.update(User, {
            userId
        }, {
            refreshToken
        });

        return update;
    };

    async clearUserRefresh(
        entityManager: EntityManager,
        userId: number
    ) {
        const update = await entityManager.update(User, {
            userId
        }, {
            refreshToken: null
        });

        return update;
    }
}