/**
 * 童限（起运）计算模块
 */

import { ChildLimit, SolarTime, Gender as TymeGender } from "tyme4ts";
import { ChildLimitResult } from "./type";
import { Gender } from "../core/type";

/**
 * 计算童限（起运）信息
 *
 * @param birthDate - 出生日期
 * @param gender - 性别
 * @returns 童限信息
 */
export function computeChildLimit(birthDate: Date, gender: Gender): ChildLimitResult {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = birthDate.getHours();
  const minute = birthDate.getMinutes();
  const second = birthDate.getSeconds();

  // 转换性别
  const tymeGender = gender === "男" ? TymeGender.MAN : TymeGender.WOMAN;

  // 创建 SolarTime 并计算童限
  const solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, second);
  const childLimit = ChildLimit.fromSolarTime(solarTime, tymeGender);

  // 获取起运信息
  const startTime = childLimit.getEndTime();

  return {
    startAge: childLimit.getYearCount() + 1, // 转为虚岁
    yearCount: childLimit.getYearCount(),
    monthCount: childLimit.getMonthCount(),
    dayCount: childLimit.getDayCount(),
    startTime: `${startTime.getYear()}年${startTime.getMonth()}月${startTime.getDay()}日`,
    isForward: childLimit.isForward(),
  };
}

/**
 * 获取 tyme4ts 的 ChildLimit 对象（供大运计算使用）
 */
export function getTymeChildLimit(birthDate: Date, gender: Gender): ChildLimit {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = birthDate.getHours();
  const minute = birthDate.getMinutes();
  const second = birthDate.getSeconds();

  const tymeGender = gender === "男" ? TymeGender.MAN : TymeGender.WOMAN;
  const solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, second);

  return ChildLimit.fromSolarTime(solarTime, tymeGender);
}
