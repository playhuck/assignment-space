import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BcryptProvider } from '@providers/bcrypt.provider';
import { DayjsProvider } from '@providers/dayjs.provider';
import { JwtProvider } from '@providers/jwt.provider';
import { RandomProvider } from '@providers/random.provider';
import { S3Provider } from '@providers/s3.provider';

import { CommonUtil } from '@utils/common.util';
import { DbUtil } from '@utils/db.util';
import { LoggerUtil } from '@utils/logger.util';

import { SpaceRepository } from '@repositories/space.repository';
import { UserRepository } from '@repositories/user.repository';

import { Space } from '@entities/space.entity';
import { SpaceRoleCode } from '@entities/space.role.code.entity';
import { SpaceRole } from '@entities/space.role.entity';
import { SpaceUserRole } from '@entities/space.user.role.entity';
import { User } from '@entities/user.entity';
import { Post } from '@entities/post.entity';
import { PostFile } from '@entities/post.file.entity';
import { PostRepository } from '@repositories/post.repository';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,

            Space,
            SpaceRole,
            SpaceUserRole,
            SpaceRoleCode,
            
            Post,
            PostFile
        ])
    ],
    providers: [
        LoggerUtil,
        DbUtil,
        CommonUtil,

        BcryptProvider,
        JwtProvider,
        DayjsProvider,
        RandomProvider,

        S3Provider,

        UserRepository,
        SpaceRepository,
        PostRepository
    ],
    exports: [
        LoggerUtil,
        DbUtil,
        CommonUtil,

        BcryptProvider,
        JwtProvider,
        DayjsProvider,
        RandomProvider,

        S3Provider,

        UserRepository,
        SpaceRepository,
        PostRepository
    ]
})
export class ProvidersModule { }