/**
 * 八字排盘主逻辑
 */

import { SolarDay, LunarHour, EightChar } from "tyme4ts";
import { BaZiResult, BaZiConfig, Gender } from "./type";
import { buildFourPillars } from "./pillar";
import { buildSpecialSigns } from "./special";
import { mergeConfig, withConfig } from "../config";

/**
 * 根据出生日期获取八字
 *
 * @param birthDate - 出生日期时间（Date 对象）
 * @param gender - 性别："男" | "女"
 * @param config - 可选配置（早晚子时、起运算法等）
 * @returns 八字排盘结果
 *
 * @example
 * ```typescript
 * const result = getBaZi(new Date("1990-05-15 10:30"), "男");
 * console.log(result.pillars.day.sixtyCycle); // "戊午"
 * console.log(result.pillars.year.sound);     // "路旁土"
 * ```
 */
export function getBaZi(
  birthDate: Date,
  gender: Gender,
  config?: Partial<BaZiConfig>
): BaZiResult {
  const mergedConfig = mergeConfig(config);

  return withConfig(mergedConfig, () => {
    return computeBaZi(birthDate, gender);
  });
}

/**
 * 根据四柱字符串获取八字（反推）
 *
 * @param yearPillar - 年柱，如"庚午"
 * @param monthPillar - 月柱，如"辛巳"
 * @param dayPillar - 日柱，如"戊午"
 * @param hourPillar - 时柱，如"甲寅"
 * @param gender - 性别
 * @param config - 可选配置
 * @returns 八字排盘结果
 *
 * @example
 * ```typescript
 * const result = getBaZiBySiZhu("庚午", "辛巳", "戊午", "甲寅", "男");
 * ```
 */
export function getBaZiBySiZhu(
  yearPillar: string,
  monthPillar: string,
  dayPillar: string,
  hourPillar: string,
  gender: Gender,
  config?: Partial<BaZiConfig>
): BaZiResult {
  const mergedConfig = mergeConfig(config);

  return withConfig(mergedConfig, () => {
    // 使用 tyme4ts 的 EightChar 反推
    const eightChar = new EightChar(yearPillar, monthPillar, dayPillar, hourPillar);

    // 尝试获取对应的公历时间（取 2000-2050 年范围内第一个匹配）
    const solarTimes = eightChar.getSolarTimes(1900, 2100);
    let birthTime = "四柱反推";
    if (solarTimes.length > 0) {
      const st = solarTimes[0];
      birthTime = `${st.getYear()}年${st.getMonth()}月${st.getDay()}日 ${st.getHour()}时`;
    }

    // 构建四柱和特殊宫位
    const pillars = buildFourPillars(eightChar);
    const specialSigns = buildSpecialSigns(eightChar);

    // 构建八字字符串
    const baziString = `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}`;

    return {
      birthTime,
      gender,
      pillars,
      specialSigns,
      baziString,
    };
  });
}

/**
 * 内部计算函数
 */
function computeBaZi(birthDate: Date, gender: Gender): BaZiResult {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = birthDate.getHours();
  const minute = birthDate.getMinutes();
  const second = birthDate.getSeconds();

  // 公历转农历
  const solarDay = SolarDay.fromYmd(year, month, day);
  const lunarDay = solarDay.getLunarDay();

  // 获取八字
  const lunarHour = LunarHour.fromYmdHms(
    lunarDay.getYear(),
    lunarDay.getMonth(),
    lunarDay.getDay(),
    hour,
    minute,
    second
  );
  const eightChar = lunarHour.getEightChar();

  // 构建四柱和特殊宫位
  const pillars = buildFourPillars(eightChar);
  const specialSigns = buildSpecialSigns(eightChar);

  // 构建八字字符串
  const baziString = `${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${eightChar.getHour()}`;

  // 格式化出生时间
  const hourBranch = eightChar.getHour().getEarthBranch().getName();
  const birthTime = `${year}年${month}月${day}日 ${hourBranch}时`;

  return {
    birthTime,
    gender,
    pillars,
    specialSigns,
    baziString,
  };
}
