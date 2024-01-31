import { ICustomRes } from '@models/interfaces/i.res';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Staff = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const response : ICustomRes = ctx.switchToHttp().getResponse();
        return response["user"];
    },
);