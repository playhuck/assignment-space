import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { CustomException } from '../exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { ICustomRes } from '@models/interfaces/i.res';
import { TDomainPath } from '@models/types/t.common';
import { SpaceRepository } from '@repositories/space.repository';

@Injectable()
export class SpacePostGuard implements CanActivate {
    constructor(
        private readonly spaceRepo: SpaceRepository
    ) { }

    async canActivate(context: ExecutionContext) {
        const req: Request = await context.switchToHttp().getRequest();
        const res: ICustomRes = await context.switchToHttp().getResponse();
        const query = req.query;

        const spaceId: number = query?.isTest ?
            +req.path.split('/')[2] :
            +req.path.split('/')[3];

        const getUserSpaceRelation = await this.spaceRepo.getUserSpaceRelation(
            spaceId,
            res.user.userId
        );

        if (!getUserSpaceRelation) {
            throw new CustomException(
                "잘못된 요청(공간 참여자가 아님)",
                ECustomExceptionCode["INTERVAL-SERVER-ERROR"],
                403
            )
        };

        res['userSpaceRelation'] = getUserSpaceRelation;

        return true
    };

}