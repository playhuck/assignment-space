import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Injectable } from '@nestjs/common';

dayjs.extend(utc);
dayjs.extend(timezone);

type TDatetimeFormatDefault = 'YYYY-MM-DD HH:mm:ss';
/** @deprecated */
type TDatetimeFormatByTheMinuteLeagcy = 'YYYY-MM-DD A hh:mm';

type TDatetimeFormatByTheUTC = 'YYYY-MM-DD(ddd), A h:mm (Z)';
type TDatetimeFormatByTheMinute = 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD, HH:mm' | 'YYYY-MM-DD hh:mm' | TDatetimeFormatByTheMinuteLeagcy;
type TDatetimeFormatByTheDate = 'YYYY-MM-DD';
type TDateTimeFormatByHourMinute = 'A hh:mm';
type TDateTimeFormatByWeekday = 'ddd';
type TDateTimeFormatByYear = 'YYYY';
type TDatetimeFormat = TDatetimeFormatDefault | TDatetimeFormatByTheMinute | TDatetimeFormatByTheDate | TDateTimeFormatByHourMinute | TDateTimeFormatByWeekday | TDatetimeFormatByTheUTC | TDateTimeFormatByYear;

Injectable()
export class DayjsProvider {

  absoulte_timezone: 'Asia/Seoul';
  // absoulte_timezone: 'Africa/Accra';

  constructor() {
    this.absoulte_timezone = 'Asia/Seoul';
  }

  get nowUtc() {
    return this.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');
  }

  /** [DB 기록용] datetime은 반드시 **utc 표준시**로 기록되어야 합니다. */
  public getDatetimeByOptions<T extends TDatetimeFormat>(
    dFormat: T,
    options?: {
      datetime: string,
      offset: {
        value: number
        unit: 'minute'
      }
    }
  ) {
    return options
      ? dayjs(options.datetime).utc(true).add(options.offset.value, options.offset.unit).format(dFormat)
      : dayjs().utc().utcOffset(0).format(dFormat);
  }

  public addTime<T extends TDatetimeFormat>(
    datetime: string,
    addedTime: number,
    addedUnit: 'month' | 'week' | 'hour' | 'minute' | 'second',
    dFormat: T
  ) {
    return dayjs(datetime).utc(true).add(addedTime, addedUnit).format(dFormat);
  }

  /**
   * [날짜 연산용]
   * @returns 반환값이 `양수`이면, 입력된 datetime이 과거의 시간임
   * @returns 반환값이 `음수`이면, 입력된 datetime이 미래의 시간임
   */
  public getDifftime(
    datetime: string,
    diffUnit: 'months' | 'hours' | 'seconds' | 'minute'
  ) {
    const dFormat = 'YYYY-MM-DD HH:mm:ss'
    const today = dayjs().utc().utcOffset(0).format(dFormat);
    return dayjs(today).utc().utcOffset(0).diff(datetime, diffUnit);
  }

  /** 
   * [FE 반환용]
   * datetime은 반드시 **utc 표준시**로 기록되어야 합니다.
   * offset은 반드시 **숫자 타입**으로 **분단위로 변환** 되어 있어야 합니다.
   */
  public getDatetimeWithOffset<T extends TDatetimeFormat>(
    datetime: string,
    dFormat: T,
    optionalOffset?: {
      value: number,
      unit: 'hour' | 'minute'
    }) {
    return optionalOffset
      ? dayjs(datetime).utc(true).add(-1 * optionalOffset.value, optionalOffset.unit).format(dFormat)
      : dayjs(datetime).utc(true).format(dFormat);
  }

}