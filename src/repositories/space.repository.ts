import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";
import { Space } from "@entities/space.entity";
import { PostSpaceDto } from "@dtos/spaces/post.space.dto";
import { SpaceRole } from "@entities/space.role.entity";
import { TAdminRole, TRoleLevel } from "@models/types/t.role";
import { SpaceUserRole } from "@entities/space.user.role.entity";

import { OWNER, NOT_OWNER_ROLE } from "@common/constants/role.constant";
import { SpaceRoleCode } from "@entities/space.role.code.entity";
import { TSortCreatedAt } from "@models/types/t.common";
import {
    IOnlySpace,
    IOnlySpaceRole,
    IOnlySpaceRoleCode,
    IOnlySpaceUserRole,
    ISpaceRelation,
    ISpaceUserRoleRelationSpaceAndSpaceRole,
    ISpaceUserRoleRelationSpaceRole
} from "@models/interfaces/i.space.return";

@Injectable()
export class SpaceRepository {

    constructor(
        @InjectRepository(Space) private spaceRepo: Repository<Space>,
        @InjectRepository(SpaceRole) private spaceRoleRepo: Repository<SpaceRole>,
        @InjectRepository(SpaceUserRole) private userRoleRepo: Repository<SpaceUserRole>,
        @InjectRepository(SpaceRoleCode) private codeRepo: Repository<SpaceRoleCode>
    ) {
    };

    async getSpaceById<T extends IOnlySpace>(
        spaceId: number
    ): Promise<T | null>{

        const space = await this.spaceRepo.findOne({
            where: {
                spaceId
            }
        });

        return space as T | null;
    };

    /** Space Role */

    async getSpaceRoleBySpaceRoleId<T extends IOnlySpaceRole>(
        spaceRoleId: number
    ): Promise<T | null> {

        const spaceRole = await this.spaceRoleRepo.findOne({
            where: {
                spaceRoleId
            }
        });

        return spaceRole as T | null;
    };

    async getSpaceRoleListBySpaceId<T extends Array<IOnlySpaceRole>>(
        spaceId: number
    ): Promise<T | []>{

        const spaceRoleList = await this.spaceRoleRepo.find({
            where: {
                spaceId
            },
            order: {
                spaceRoleId: 'ASC'
            }
        });

        return spaceRoleList as T | [];
    };


    /** Space User Role */

    async getSpaceUserRoleByUserId<T extends Array<IOnlySpaceUserRole>>(
        userId: number,
        skip: number,
        take: number,
        sortCraetedAt: TSortCreatedAt
    ): Promise<T | []> {

        const spaceUserRole = await this.userRoleRepo.find({
            where: {
                userId
            },
            order: {
                createdAt: sortCraetedAt,
                spaceUserRoleId: 'DESC'
            },
            skip,
            take
        });

        return spaceUserRole as T | [];
    }

    async getSpaceUserRoleByIds<T extends ISpaceUserRoleRelationSpaceRole>(
        spaceId: number,
        userId: number,
        spaceRoleId: number
    ): Promise<T | null>{

        const spaceUserRole = await this.userRoleRepo.findOne({
            where: {
                spaceId,
                userId,
                spaceRoleId
            },
            relations: {
                spaceRole: true
            },
        });

        return spaceUserRole as T | null;
    };

    async getSpaceUserRoleForGuard<T extends IOnlySpaceUserRole>(
        spaceId: number,
        userId: number
    ): Promise<T | null> {

        const userSpaceRelaiton = await this.userRoleRepo.findOne({
            where: {
                spaceId,
                userId
            }
        });

        return userSpaceRelaiton as T | null;

    };

    async getSpaceUserRoleBySpaceRoleId<T extends IOnlySpaceUserRole>(
        spaceRoleId: number
    ): Promise<T | null>{

        const spaceUserRole = await this.userRoleRepo.findOne({
            where: {
                spaceRoleId
            }
        });

        return spaceUserRole as T | null;
    };

    async getSpaceUserRoleListBySpaceId<T extends Array<IOnlySpaceUserRole>>(
        spaceId: number
    ): Promise<T | []> {
        
        const spaceUserRoleList = await this.userRoleRepo.find({
            where: {
                spaceId
            }
        });

        return spaceUserRoleList as T | [];
    }

    async getSpaceRoleCodeByCode<T extends IOnlySpaceRoleCode>(
        code: string
    ): Promise<T | null>{

        const codeEntity = await this.codeRepo.findOne({
            where: {
                code
            }
        });

        return codeEntity as T | null
    };

    async getSpaceRoleCodeByRoleId<T extends IOnlySpaceRoleCode>(
        spaceRoleId: number
    ): Promise<T | null> {

        const codeEntity = await this.codeRepo.findOne({
            where: {
                spaceRoleId
            }
        });

        return codeEntity as T | null;
    };

    async getUserSpaceRelation<T extends ISpaceUserRoleRelationSpaceAndSpaceRole>(
        spaceId: number,
        userId: number
    ): Promise<T | null> {
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

        return userSpaceRelaiton as T | null;

    };

    async getSpaceRelation<T extends ISpaceRelation>(
        spaceId: number
    ): Promise<T | null>{

        const spaceRelation = await this.spaceRepo.findOne({
            where: {
                spaceId
            },
            relations: ['spaceRoles', 'spaceUserRoles'],
            select: {
                spaceId: true,
                userId: true,
                spaceName: true,
                spaceLogo: true,
                spaceRoles : {
                    spaceRoleId: true,
                    roleName: true,
                    roleLevel: true
                },
                spaceUserRoles: {
                    spaceRoleId: true,
                    spaceUserRoleId: true,
                    userId: true
                }
            }
        });

        return spaceRelation as T | null;
        
    }

    async insertSpace(
        entityManager: EntityManager,
        {
            spaceLogo,
            spaceName
        }: Pick<PostSpaceDto, 'spaceLogo' | 'spaceName'>,
        createdAt: string,
        userId: number
    ){

        const insert = await entityManager.insert(Space, {
            spaceLogo,
            spaceName,
            createdAt,
            userId
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

    async insertSpaceRoleCode(
        entityManager: EntityManager,
        spaceRoleId: number,
        spaceId: number,
        code: string
    ){

        const insert = await entityManager.insert(SpaceRoleCode, {
            spaceRoleId,
            spaceId,
            code
        });

        return insert;
    };

    async updateSpaceName(
        entityManager: EntityManager,
        spaceId: number,
        spaceName: string
    ){

        const updateSpaceName = await entityManager.update(Space, {
            spaceId
        }, {
            spaceName
        });

        return updateSpaceName;
    };

    async updateSpaceLogo(
        entityManager: EntityManager,
        spaceId: number,
        spaceLogo: string
    ){

        const updateSpaceLogo = await entityManager.update(Space, {
            spaceId
        }, {
            spaceLogo
        });

        return updateSpaceLogo;
    };

    async updateSpaceRole(
        entityManager: EntityManager,
        spaceId: number,
        targetSpaceRoleId: number,
        targetUserRoleId: number
    ){

        const updateSpaceRole = await entityManager.update(SpaceUserRole, {
            spaceId,
            userId: targetUserRoleId
        }, {
            spaceRoleId: targetSpaceRoleId
        });

        return updateSpaceRole;

    }

    async deleteSpaceRole(
        entityManager: EntityManager,
        spaceRoleId: number
    ){
        const spaceRoleRelation = await entityManager.findOne(SpaceRole, {
            where: {
                spaceRoleId
            },
            relations: [
                'spaceUserRoles',
                'spaceRoleCodes'
            ]
        });

        const deleteSpaceRole = await entityManager.softRemove(SpaceRole, spaceRoleRelation!);

        return deleteSpaceRole;
    };

    async deleteSpaceUserRole(
        entityManager: EntityManager,
        userId: number,
        spaceUserRoleId: number
    ) {

        const deleteSpaceUserRole = await entityManager.softDelete(SpaceUserRole, {
            userId,
            spaceUserRoleId
        });

        return deleteSpaceUserRole;
    }

    async deleteSpace(
        entityManager: EntityManager,
        spaceId: number
    ) {

        const spaceRelation = await entityManager.findOne(Space, {
            where: {
                spaceId
            },
            relations: [
                'spaceRoles',
                'spaceUserRoles',
                'spaceRoleCodes'
            ]
        });

        const deleteSpace = await entityManager.softRemove(Space, spaceRelation!);
        
        return deleteSpace;
    };

}