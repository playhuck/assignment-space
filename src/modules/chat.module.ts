import { ChatController } from '@controllers/chat.controller';
import { Module } from '@nestjs/common';
import { ChatService } from '@services/chat.service';

@Module({
    providers: [ChatService],
    controllers: [ChatController]
})
export class ChatModule {}
