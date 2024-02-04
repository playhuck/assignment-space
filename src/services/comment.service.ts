import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { SpacePostParamDto } from '@dtos/posts/space.post.parma.dto';
import { ISpaceUserRoleRelationSpaceAndSpaceRole } from '@models/interfaces/i.space.return';
import { DayjsProvider } from '@providers/dayjs.provider';
import { PostRepository } from '@repositories/post.repository';
import { SpaceRepository } from '@repositories/space.repository';
import { UserRepository } from '@repositories/user.repository';
import { DbUtil } from '@utils/db.util';

@Injectable()
export class CommentService {

    constructor(
        private readonly db: DbUtil,

        private readonly dayjs: DayjsProvider,

        private readonly spaceRepo: SpaceRepository,
        private readonly postRepo: PostRepository,
        private readonly userRepo: UserRepository
    ){}

    async postComment(
        userRelation: ISpaceUserRoleRelationSpaceAndSpaceRole,
        param: SpacePostParamDto
    ){

        await this.db.transaction(
            async(entityManager: EntityManager, args) => {

                const { userRelation, param } = args;
                const { userId } = userRelation;
                const { spaceId, postId } = param;

        }, {
            userRelation,
            param
        })
    };
    
}
