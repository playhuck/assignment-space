import { Injectable } from '@nestjs/common';
import { EntityManager, InsertResult } from 'typeorm';
import { ResultSetHeader } from 'mysql2';

import { DayjsProvider } from '@providers/dayjs.provider';
import { RandomProvider } from '@providers/random.provider';
import { S3Provider } from '@providers/s3.provider';

import { DbUtil } from '@utils/db.util';

import { SpaceRepository } from '@repositories/space.repository';
import { UserRepository } from '@repositories/user.repository'

import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';

import { PostSpaceDto } from '@dtos/spaces/post.space.dto';
import { IUser } from '@models/interfaces/i.user';
import { TAdminRole, TDefaultRole, TRole } from '@models/types/t.role';

import { OWNER, ADMIN_ROLE, NOT_ADMIN_ROLE } from '@common/constants/role.constant';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { PostSpaceJoinDto } from '@dtos/spaces/post.space.join.dto';
import { SpaceRoleParamDto } from '@dtos/spaces/space.role.param.dto';

@Injectable()
export class SpaceService {

    constructor(
        private readonly db: DbUtil,

        private readonly dayjs: DayjsProvider,
        private readonly random: RandomProvider,

        private readonly s3: S3Provider,

        private readonly userRepo: UserRepository,
        private readonly spaceRepo: SpaceRepository
    ) { }

    async postSpace(
        user: IUser,
        body: PostSpaceDto
    ) {

        const getPresignedUrl = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { body, user } = args;
                const { roleList, spaceOwnerRoleName } = body;

                const createdAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                const insertSpace = await this.spaceRepo.insertSpace(
                    entityManager,
                    args.body,
                    createdAt,
                    user.userId
                );
                if (insertSpace.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "공간 생성 실패",
                        ECustomExceptionCode['AWS-RDS-EXCEPTION'],
                        500
                    )
                };

                const { insertId: spaceId } = insertSpace.raw as ResultSetHeader;

                const insertOwnerSpaceRole = await this.spaceRepo.insertSpaceRole(
                    entityManager,
                    spaceId,
                    spaceOwnerRoleName,
                    'owner',
                    createdAt,
                    OWNER
                );

                if (insertOwnerSpaceRole.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "공간 소유주 역할 생성에 실패 했습니다.",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };
                const { insertId: spaceRoleId } = insertOwnerSpaceRole.raw as ResultSetHeader;

                const insertOwnerSpaceUserRole = await this.spaceRepo.insertSpaceUserRole(
                    entityManager,
                    spaceId,
                    user.userId,
                    spaceRoleId,
                    createdAt
                );
                if (insertOwnerSpaceUserRole.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "공간 소유주 역할 생성에 실패 했습니다.",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

                const insertOwnerSpaceRoleCode = await this.spaceRepo.insertSpaceRoleCode(
                    entityManager,
                    insertOwnerSpaceRole?.raw.insertId,
                    await this.random.generateRandomString(8)
                );

                if (insertOwnerSpaceRoleCode.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "공간 역할 코드 생성에 실패 했습니다.",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

                await Promise.all(roleList.map(async (roleList, i) => {

                    const { roleName, roleLevel, defaultRole, roles } = roleList;
                    const code = await this.random.generateRandomString(8);

                    const roleType = this.getRoleType(defaultRole, roles);

                    const insertSpaceRole: InsertResult = await this.spaceRepo.insertSpaceRole(
                        entityManager,
                        spaceId,
                        roleName,
                        roleLevel,
                        createdAt,
                        roleType
                    );

                    if (insertSpaceRole.generatedMaps.length !== 1) {
                        throw new CustomException(
                            "공간 역할 생성에 실패 했습니다.",
                            ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                            500
                        )
                    };

                    const insertSpaceRoleCode = await this.spaceRepo.insertSpaceRoleCode(
                        entityManager,
                        insertSpaceRole?.raw.insertId,
                        code
                    );

                    if (insertSpaceRoleCode.generatedMaps.length !== 1) {
                        throw new CustomException(
                            "공간 역할 코드 생성에 실패 했습니다.",
                            ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                            500
                        )
                    };

                }));

                let getPresignedUrl;

                if (body?.spaceLogo) {
                    getPresignedUrl = await this.s3.getPresignedUrl(
                        user.userId,
                        spaceId,
                        body?.spaceLogo,
                        body?.spaceLogoExtension
                    );
                };

                return getPresignedUrl ? getPresignedUrl : undefined;

            }, { body, user });

        return getPresignedUrl;

    };

    async postSpaceJoin(
        user: IUser,
        param: SpaceParamDto,
        body: PostSpaceJoinDto
    ) {

        void await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { spaceId } = param;
                const { joinCode } = body;
                const createdAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

                const code = await this.spaceRepo.getSpaceRoleCodeByCode(joinCode);
                if(!code){
                    throw new CustomException(
                        "유효하지 않은 코드",
                        ECustomExceptionCode["SPACE-002"],
                        400
                    )
                };

                console.log("CODE:", code);
                
                const { spaceRoleId } = code;
                
                const insertSpaceUserRole = await this.spaceRepo.insertSpaceUserRole(
                    entityManager,
                    spaceId,
                    userId,
                    spaceRoleId,
                    createdAt
                );
                console.log("INSERT USER ROLE:",insertSpaceUserRole);
                
                if(insertSpaceUserRole.generatedMaps.length !== 1){
                    throw new CustomException(
                        "공간 참여 실패",
                        ECustomExceptionCode["AWS-RDS-EXCEPTION"],
                        500
                    )
                };

            }, {
            user,
            param,
            body
        })
    }

    async updateSpace(
        spaceId: number
    ) {

        await this.db.transaction(
            async (entityManager, args) => {

            }, { spaceId })
    };

    async updateSpaceRole() {
        await this.db.transaction(
            async(entityManager: EntityManager, args) => {

                const { } = args; 
            }, {
            }
        );
    }

    async deleteSpace() {

        await this.db.transaction(
            async(entityManager: EntityManager, args) => {

                const { } = args; 
            }, {
            }
        );
    };

    async deleteSpaceRole(
        param: SpaceRoleParamDto
    ) {

        void await this.db.transaction(
            async(entityManager: EntityManager, args) => {

                const { param } = args;
                const { spaceRoleId } = param;
                
                const isUsedSpaceRole = await this.spaceRepo.getSpaceUserRoleBySpaceRoleId(spaceRoleId);
                if(isUsedSpaceRole){
                    throw new CustomException(
                        "누군가 사용중인 역할",
                        ECustomExceptionCode["ROLE-002"],
                        400
                    )
                };

                const deleteSpaceRole = await this.spaceRepo.deleteSpaceRole(
                    entityManager,
                    spaceRoleId
                );
                if(deleteSpaceRole.affected !== 1){
                    throw new CustomException(
                        "역할 삭제중 문제가 발생",
                        ECustomExceptionCode['AWS-RDS-EXCEPTION'],
                        500
                    )
                };
                
            }, {
                param
            }
        )
    };

    async getSpace() { };

    async getMySpaceList() { };

    public getRoleType(defaultRole: TRole, roles?: TAdminRole | undefined) {
        const roleType =
            defaultRole === 'admin' ?
                ADMIN_ROLE : defaultRole === 'joiner' ? NOT_ADMIN_ROLE : roles as TAdminRole

        return roleType;
    }

}
