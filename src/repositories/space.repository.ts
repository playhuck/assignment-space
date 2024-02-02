import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";
import { Space } from "@entities/space.entity";
import { PostSpaceDto } from "@dtos/spaces/post.space.dto";
import { User } from "@entities/user.entity";
import { SpaceRole } from "@entities/space.role.entity";
import { TDefaultRole } from "@models/types/t.role";
import { IRoleList } from "@models/interfaces/i.role";

@Injectable()
export class SpaceRepository {

    constructor(
        @InjectRepository(Space) private spaceRepo: Repository<Space>,
        @InjectRepository(SpaceRole) private spaceRoleRepo: Repository<SpaceRole>
    ) {
    };

    async getSpaceById(
        spaceId: number
    ){

        const space = await this.spaceRepo.findOne({
            where: {
                spaceId
            }
        });

        return space;
    };

    async insertSpace(
        entityManager: EntityManager,
        body: PostSpaceDto,
        createdAt: string,
        user: User,
        adminCode: string,
        joinerCode: string
    ){

        const { 
            spaceLogo, 
            spaceName
        } = body;

        const insert = await entityManager.insert(Space, {
            spaceLogo,
            spaceName,
            createdAt,
            user,
            adminCode,
            joinerCode
        });

        return insert
    };

    async insertSpaceRole(
        entityManager: EntityManager,
        spaceId: number,
        roleName: string,
        createdAt: string,
        role: TDefaultRole
    ){

        const insert = await entityManager.insert(SpaceRole, {
            spaceId,
            roleName,
            ...role,
            createdAt
        });

        return insert
    }

}