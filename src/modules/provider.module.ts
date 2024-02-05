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
import { PostRepository } from '@repositories/post.repository';
import { CommentRepository } from '@repositories/comment.repository';
import { AlarmRepository } from '@repositories/alarm.repository';

import { Space } from '@entities/space.entity';
import { SpaceRoleCode } from '@entities/space.role.code.entity';
import { SpaceRole } from '@entities/space.role.entity';
import { SpaceUserRole } from '@entities/space.user.role.entity';
import { User } from '@entities/user.entity';
import { Post } from '@entities/post.entity';
import { PostFile } from '@entities/post.file.entity';
import { CommentReply } from '@entities/post.comment.reply.entity';
import { Comment } from '@entities/post.comment.entity';
import { SpaceUserAlarm } from '@entities/space.user.alarm.entity';
import { SpaceUserAlarmSettings } from '@entities/space.user.alarm.settings.entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,

            Space,
            SpaceRole,
            SpaceUserRole,
            SpaceRoleCode,
            SpaceUserAlarm,
            SpaceUserAlarmSettings,
            
            Post,
            PostFile,

            Comment,
            CommentReply
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
        AlarmRepository,
        PostRepository,
        CommentRepository
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
        AlarmRepository,
        PostRepository,
        CommentRepository
    ]
})
export class ProvidersModule { }