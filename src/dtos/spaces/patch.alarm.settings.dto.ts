import { IsNotEmptyBoolean } from "@common/decorators/cv.not.empty.decorator";

export class PatchAlarmSettingsDto {

        @IsNotEmptyBoolean()
        commentCreate!: boolean;

        @IsNotEmptyBoolean()
        postCreate!: boolean;

        @IsNotEmptyBoolean()
        postUpdate!: boolean;
}