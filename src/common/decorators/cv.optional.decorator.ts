import { IsBoolean, IsOptional, IsNumber, IsString } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function IsOptionalString() {
    return applyDecorators(IsOptional(), IsString());
};

export function IsOptionalBoolean() {
    return applyDecorators(IsOptional(), IsBoolean());
};

export function IsOptionalNumber() {
    return applyDecorators(Transform(v => parseInt(v.value)), IsOptional(), IsNumber());
};