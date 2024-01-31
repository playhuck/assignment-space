import { PostController } from '@controllers/post.controller';
import { Module } from '@nestjs/common';
import { PostService } from '@services/post.service';

@Module({
    providers: [PostService],
    controllers: [PostController]
})
export class PostModule {}
