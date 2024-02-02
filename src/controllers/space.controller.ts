import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { SpaceService } from '@services/space.service';

@Controller('space')
export class SpaceController {

    constructor(private readonly service: SpaceService) { };

    @Post('')
    async postSpace() { };

    @Patch('')
    async updateSpace() { };

    @Delete('')
    async deleteSpace() { };

    @Get('/:spaceId')
    async getSpace() { };

    @Get('/:userId/list')
    async getMySpaceList() { };

    @Post('/join')
    async postJoinSpace() { };

}
