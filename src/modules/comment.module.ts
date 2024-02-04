import { CommentController } from '@controllers/comment.controller';
import { Module } from '@nestjs/common';
import { CommentService } from '@services/comment.service';

@Module({
    providers: [CommentService],
    controllers: [CommentController]
})
export class CommentModule {}
