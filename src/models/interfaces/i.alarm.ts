import { SpaceUserAlarmSettings } from "@entities/space.user.alarm.settings.entity";

interface IAlarmOptions extends Pick<SpaceUserAlarmSettings, 'postCreate' | 'postUpdate' | 'commentCreate'> {};

export {
    IAlarmOptions
}