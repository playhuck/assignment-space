import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function IsNotEmptyString() {
    return applyDecorators(IsNotEmpty(), IsString());
};

export function IsNotEmptyEmail() {
    return applyDecorators(IsNotEmpty(), IsString(), IsEmail());
}

export function IsNotEmptyBoolean() {
    return applyDecorators(IsNotEmpty(), IsBoolean(), Transform(v => v.value === 'true'));
};

export function IsNotEmptyNumber() {
    return applyDecorators(Transform(v => parseInt(v.value)), IsNotEmpty(), IsNumber());
};

export function IsNotEmptyArray() {
    return applyDecorators(IsNotEmpty(), IsArray());
}