import { PostSpaceDto } from '@dtos/spaces/post.space.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceService {

    async postSpace(
        body: PostSpaceDto
    ) {

        /**
         * 1. 역할을 공간 생성시 구성할 수 있다.
         * 2. 역할은 DEFAULT 역할과 CUSTOM 역할이 있다.
         * 3. CUSTOM 역할은 소유자의 권한을 제외한 나머지 값들을 지정할 수 있다.
         */
    };

    async updateSpace() { };
    
    async deleteSpace() { };

    async getSpace() { };

    async getMySpaceList() { };

    async postJoinSpace() { };
}
