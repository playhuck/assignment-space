import { UserController } from '@controllers/user.controller';
import { Module } from '@nestjs/common';
import { UserService } from '@services/user.service';

@Module({
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}
