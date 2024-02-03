import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";
import { Space } from "@entities/space.entity";
import { PostSpaceDto } from "@dtos/spaces/post.space.dto";
import { User } from "@entities/user.entity";
import { SpaceRole } from "@entities/space.role.entity";
import { TAdminRole, TDefaultRole, TRoleLevel } from "@models/types/t.role";
import { SpaceUserRole } from "@entities/space.user.role.entity";

import { OWNER, NOT_OWNER_ROLE } from "@common/constants/role.constant";
import { IUser } from "@models/interfaces/i.user";

@Injectable()
export class SpaceRepository {

    constructor(
        @InjectRepository(Space) private spaceRepo: Repository<Space>,
        @InjectRepository(SpaceRole) private spaceRoleRepo: Repository<SpaceRole>,
        @InjectRepository(SpaceUserRole) private userRoleRepo: Repository<SpaceUserRole>
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

    async getSpaceRoleBySpaceRoleId(
        spaceRoleId: number
    ) {

        const spaceRole = await this.spaceRoleRepo.findOne({
            where: {
                spaceRoleId
            }
        });

        return spaceRole;
    };

    async getSpaceUserRoleByUserId(
        userId: number
    ) {

        const spaceUserRole = await this.userRoleRepo.find({
            where: {
                userId
            },
            order: {
                spaceUserRoleId: 'DESC'
            }
        });

        return spaceUserRole;
    }

    async getSpaceUserRoleByIds(
        spaceId: number,
        userId: number,
        spaceRoleId: number
    ) {

        const spaceUserRole = await this.userRoleRepo.findOne({
            where: {
                spaceId,
                userId,
                spaceRoleId
            }
        });

        return spaceUserRole;
    };

    async getSpaceUserRoleForGuard(
        spaceId: number,
        userId: number
    ) {

        const userSpaceRelaiton = await this.userRoleRepo.findOne({
            where: {
                spaceId,
                userId
            }
        });

        return userSpaceRelaiton

    };

    async getUserSpaceRelation(
        spaceId: number,
        userId: number
    ){
        const userSpaceRelaiton = await this.userRoleRepo.findOne({
            where: {
                spaceId,
                userId
            },
            relations: {
                spaceRole: true,
                space: true
            }
        });

        return userSpaceRelaiton
        
    };

    async getSpaceRoleListBySpaceId(
        spaceId: number
    ){

        const spaceRoleList = await this.spaceRoleRepo.find({
            where: {
                spaceId
            },
            order: {
                spaceRoleId: 'ASC'
            }
        });

        return spaceRoleList;
    }

    async insertSpace(
        entityManager: EntityManager,
        {
            spaceLogo,
            spaceName
        }: Pick<PostSpaceDto, 'spaceLogo' | 'spaceName'>,
        createdAt: string,
        userId: number,
        adminCode: string,
        joinerCode: string
    ){

        const insert = await entityManager.insert(Space, {
            spaceLogo,
            spaceName,
            createdAt,
            userId,
            adminCode,
            joinerCode
        });

        return insert
    };

    async insertSpaceRole(
        entityManager: EntityManager,
        spaceId: number,
        roleName: string,
        roleLevel: TRoleLevel,
        createdAt: string,
        roleType: TAdminRole
    ){

        const insert = await entityManager.insert(SpaceRole, {
            spaceId,
            roleName,
            roleLevel,
            createdAt,
            ...NOT_OWNER_ROLE,
            ...roleType

        });

        return insert
    };

    async insertOwnerSpaceRole(
        entityManager: EntityManager,
        spaceId: number,
        roleName: string,
        createdAt: string
    ){

        const insert = await entityManager.insert(SpaceRole, {
            spaceId,
            roleName,
            ...OWNER,
            roleLevel: 'owner',
            createdAt
        });

        return insert
    };

    async insertSpaceUserRole(
        entityManager: EntityManager,
        spaceId: number,
        userId: number,
        spaceRoleId: number,
        createdAt: string
    ){

        const insert = await entityManager.insert(SpaceUserRole, {
            spaceId,
            userId,
            spaceRoleId,
            createdAt
        });

        return insert
    };

}