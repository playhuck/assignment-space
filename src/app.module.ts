import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth.module';
import { ChatModule } from '@modules/chat.module';
import { PostModule } from '@modules/post.module';
import { SpaceModule } from '@modules/space.module';
import { UserModule } from '@modules/user.module';
import { CustomConfigModule } from '@modules/config.module';
import { CustomTypeOrmModule } from '@modules/typeorm.module';

@Module({
  imports: [
    CustomConfigModule,
    CustomTypeOrmModule,
    AuthModule,
    ChatModule,
    PostModule,
    SpaceModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
