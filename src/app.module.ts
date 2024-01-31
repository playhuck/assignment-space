import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { ChatModule } from './modules/chat.module';
import { PostModule } from './modules/post.module';
import { SpaceModule } from './modules/space.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    PostModule,
    SpaceModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
