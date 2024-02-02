import { ADMIN, OWNER } from '@common/constants/role.constant';
import { CustomException } from '@common/exception/custom.exception';
import { PostSpaceDto } from '@dtos/spaces/post.space.dto';
import { User } from '@entities/user.entity';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { TDefaultRole, TRole } from '@models/types/t.role';
import { Injectable } from '@nestjs/common';
import { DayjsProvider } from '@providers/dayjs.provider';
import { RandomProvider } from '@providers/random.provider';
import { S3Provider } from '@providers/s3.provider';
import { SpaceRepository } from '@repositories/space.repository';
import { UserRepository } from '@repositories/user.repository';
import { DbUtil } from '@utils/db.util';
import { ResultSetHeader } from 'mysql2';
import { EntityManager, InsertResult } from 'typeorm';

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
        userId: number,
        body: PostSpaceDto
    ) {

        const getPresignedUrl = await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { body, userId } = args;
                const { roleList } = body;

                const createdAt = this.dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');
                const adminCode = await this.random.generateRandomString(8);
                const joinerCode = await this.random.generateRandomString(8);

                const user = await this.userRepo.getUserById(userId);

                const insertSpace = await this.spaceRepo.insertSpace(
                    entityManager,
                    args.body,
                    createdAt,
                    user!,
                    adminCode,
                    joinerCode
                );
                if (insertSpace.generatedMaps.length !== 1) {
                    throw new CustomException(
                        "공간 생성 실패",
                        ECustomExceptionCode['AWS-RDS-EXCEPTION'],
                        500
                    )
                };

                const { insertId } = insertSpace.raw as ResultSetHeader;

                await Promise.all(roleList.map(async (roles, i) => {

                    const { roleName, defaultRole } = roles;

                    const roleType = this.getRoleType(defaultRole, roles.role);

                    const insertSpaceRole: InsertResult = await this.spaceRepo.insertSpaceRole(
                        entityManager,
                        insertId,
                        roleName,
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

                }));

                let getPresignedUrl;

                if (body?.spaceLogo) {
                    getPresignedUrl = await this.s3.getPresignedUrl(
                        userId,
                        insertId,
                        body?.spaceLogo,
                        body?.spaceLogoExtension
                    );
                };

                return getPresignedUrl ? getPresignedUrl : undefined;

            }, { body, userId });

        return getPresignedUrl;

    };

    async updateSpace() { };

    async deleteSpace() { };

    async getSpace() { };

    async getMySpaceList() { };

    async postJoinSpace() { };

    private getRoleType(defaultRole: TRole, roles: TDefaultRole | undefined) {
        const roleType =
            defaultRole === 'admin' ?
                ADMIN : defaultRole === 'owner' ?
                    OWNER : roles as TDefaultRole

        return roleType;
    }

}
