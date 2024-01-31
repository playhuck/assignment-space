import { User } from '@entities/user.entity';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptProvider } from '@providers/bcrypt.provider';
import { JwtProvider } from '@providers/jwt.provider';
import { UserRepository } from '@repositories/user.repository';
import { DbUtil } from '@utils/db.util';
import { LoggerUtil } from '@utils/logger.util';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            User
        ])
    ],
    providers: [
        LoggerUtil,
        DbUtil,

        BcryptProvider,
        JwtProvider,

        UserRepository
    ],
    exports: [
        LoggerUtil,
        DbUtil,

        BcryptProvider,
        JwtProvider,

        UserRepository
    ]
})
export class ProvidersModule { }