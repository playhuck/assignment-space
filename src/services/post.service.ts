import { CustomException } from '@common/exception/custom.exception';
import { PostPostDto } from '@dtos/posts/post.post.dto';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { IUser } from '@models/interfaces/i.user';
import { Injectable } from '@nestjs/common';
import { PostRepository } from '@repositories/post.repository';
import { SpaceRepository } from '@repositories/space.repository';
import { DbUtil } from '@utils/db.util';
import { EntityManager } from 'typeorm';

@Injectable()
export class PostService {

    constructor(
        private readonly db: DbUtil,

        private readonly spaceRepo: SpaceRepository,
        private readonly postRepo: PostRepository
    ){};

    async postQuestion(
        user: IUser,
        param: SpaceParamDto,
        body: PostPostDto
    ) {

        await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
                const { userId } = user;
                const { spaceId } = param;
                const { 
                    postContents, 
                    postFileList, 
                    postName,
                    isAnonymous
                } = body;

                const getSpaceRelation = await this.spaceRepo.getUserSpaceRelation(
                    spaceId,
                    userId
                );
                if(isAnonymous && getSpaceRelation?.spaceRole.roleLevel !== 'joiner') {
                    throw new CustomException(
                        "참여자만 익명으로 작성할 수 있습니다.",
                        ECustomExceptionCode['ROLE-005'],
                        401
                    )
                };




            }, {
            user,
            param,
            body
        })
    };

    async postNotice(
        user: IUser,
        param: SpaceParamDto,
        body: PostPostDto
    ) {

        await this.db.transaction(
            async (entityManager: EntityManager, args) => {

                const { user, param, body } = args;
            }, {
            user,
            param,
            body
        })
    };
    
    async postUpdate(){};
    
    async postDelete(){};

    async postList(){};

    async getPost(){};
}
