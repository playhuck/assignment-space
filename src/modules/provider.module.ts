import { Space } from '@entities/space.entity';
import { SpaceRoleCode } from '@entities/space.role.code.entity';
import { SpaceRole } from '@entities/space.role.entity';
import { SpaceUserRole } from '@entities/space.user.role.entity';
import { User } from '@entities/user.entity';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptProvider } from '@providers/bcrypt.provider';
import { DayjsProvider } from '@providers/dayjs.provider';
import { JwtProvider } from '@providers/jwt.provider';
import { RandomProvider } from '@providers/random.provider';
import { S3Provider } from '@providers/s3.provider';
import { SpaceRepository } from '@repositories/space.repository';
import { UserRepository } from '@repositories/user.repository';
import { DbUtil } from '@utils/db.util';
import { LoggerUtil } from '@utils/logger.util';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Space,
            SpaceRole,
            SpaceUserRole,
            SpaceRoleCode
        ])
    ],
    providers: [
        LoggerUtil,
        DbUtil,

        BcryptProvider,
        JwtProvider,
        DayjsProvider,
        RandomProvider,

        S3Provider,

        UserRepository,
        SpaceRepository
    ],
    exports: [
        LoggerUtil,
        DbUtil,

        BcryptProvider,
        JwtProvider,
        DayjsProvider,
        RandomProvider,

        S3Provider,

        UserRepository,
        SpaceRepository
    ]
})
export class ProvidersModule { }