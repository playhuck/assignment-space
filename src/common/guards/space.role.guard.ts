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
export class SpaceRoleGuard implements CanActivate {
    constructor(
        private readonly spaceRepo: SpaceRepository
    ) { }

    async canActivate(context: ExecutionContext) {
        const req: Request = await context.switchToHttp().getRequest();
        const res: ICustomRes = await context.switchToHttp().getResponse();
        const query = req.query;

        console.log(res.userId);
        

        const rolePath = query?.isTest ?
            req.path.split('/')[1] as TDomainPath :
            req.path.split('/')[3] as TDomainPath;

        const spaceId: number = query?.isTest ?
            +req.path.split('/')[2] :
            +req.path.split('/')[4];

        if (rolePath === 'owner') {

            const space = await this.spaceRepo.getSpaceById(spaceId);
            if (!space) {
                throw new CustomException(
                    "공간을 찾을 수 없습니다.",
                    ECustomExceptionCode["SPACE-001"],
                    403
                )
            };

            if (res.userId !== space.userId) {
                throw new CustomException(
                    "소유자만 이용할 수 있습니다.",
                    ECustomExceptionCode["ROLE-001"],
                    401
                )
            };

        };


        return true
    };

}