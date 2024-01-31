import { HttpStatus, ValidationError } from "@nestjs/common";
import { ECustomExceptionCode } from "@models/enums/e.exception.code";

export class CustomException extends Error {
    stack?: string;

    errorCode: string | ECustomExceptionCode;
    statusCode: number;

    constructor(message: string, errorCode: string | ECustomExceptionCode, statusCode: number) {
        super();

        this.name = 'CustomException';
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}

export class CustomValidationPipeException extends CustomException {
    constructor(validationErrors: ValidationError[]) {
        const firstError = validationErrors[0];

        firstError.constraints

        const errorMessage = Object.values(firstError.constraints as unknown as string)[0];
        const errorCode = ECustomExceptionCode['DTO-VALIDATION-FAILED'];

        super(errorMessage, errorCode, HttpStatus.BAD_REQUEST);
    }
}