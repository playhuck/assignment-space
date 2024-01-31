import { SpaceController } from '@controllers/space.controller';
import { Module } from '@nestjs/common';
import { SpaceService } from '@services/space.service';

@Module({
    providers: [SpaceService],
    controllers: [SpaceController]
})
export class SpaceModule {}
