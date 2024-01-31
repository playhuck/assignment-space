import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth.module';
import { ChatModule } from '@modules/chat.module';
import { PostModule } from '@modules/post.module';
import { SpaceModule } from '@modules/space.module';
import { UserModule } from '@modules/user.module';
import { CustomConfigModule } from '@modules/config.module';
import { CustomTypeOrmModule } from '@modules/typeorm.module';
import { ProvidersModule } from '@modules/provider.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CustomConfigModule,
    CustomTypeOrmModule,
    ProvidersModule,
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
