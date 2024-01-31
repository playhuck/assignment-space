import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from '@models/interfaces/i.error';
import { CustomException } from './custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { LoggerUtil } from '@utils/logger.util';
import { TNODE_ENV } from '@models/types/t.node.env';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    stage: TNODE_ENV;
    logger: LoggerUtil | undefined;

    constructor(stage: TNODE_ENV) {
        this.stage = stage;
        this.logger = stage === 'dev' ? new LoggerUtil() : undefined
    };

    catch(exception: unknown, host: ArgumentsHost): void | CustomException {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response
            .status(this.statusCode(exception))
            .json({
                isSuccess: false,
                ...this.errorResponse(exception)
            });
    }

    private statusCode(exception: unknown): number {
        if (exception instanceof CustomException) {
            return exception?.statusCode ?? HttpStatus.BAD_REQUEST;
        }

        if (exception instanceof HttpException) {
            return exception.getStatus();
        }

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private errorResponse(exception: unknown): IErrorResponse {
        const errResponse = exception?.['response'];

        if (exception instanceof CustomException) {
            return {
                errorCode: errResponse?.['errorCode'] ?? exception?.['errorCode'],
                errorType: exception?.['name'],
                errorMessage: errResponse?.['errorMessage'] ?? exception?.['message']
            }
        }

        return {
            errorCode: ECustomExceptionCode["UNKNOWN-SERVER-ERROR"],
            errorType: exception?.['name'],
            errorMessage: errResponse?.['errorMessage'] ?? exception?.['message']
        }
    }
}