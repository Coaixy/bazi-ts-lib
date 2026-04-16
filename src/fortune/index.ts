/**
 * 大运流年模块入口
 */

import { SixtyCycle } from "tyme4ts";
import { FortuneResult, AnnualFortuneInfo } from "./type";
import { BaZiResult, BaZiConfig, Gender } from "../core/type";
import { mergeConfig, withConfig } from "../config";
import { computeChildLimit, getTymeChildLimit } from "./childLimit";
import { buildDecadeList } from "./decade";
import { getAnnualFortune, getAnnualFortuneList } from "./annual";

export * from "./type";

/**
 * 获取大运流年信息
 *
 * @param baziResult - 八字排盘结果
 * @param birthDate - 出生日期
 * @param config - 可选配置
 * @returns 大运流年结果
 *
 * @example
 * ```typescript
 * const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
 * const fortune = getFortune(bazi, new Date("1990-05-15 10:30"));
 * console.log(fortune.childLimit.startAge);  // 起运虚岁
 * console.log(fortune.decades[0].sixtyCycle); // 第一步大运
 * ```
 */
export function getFortune(
  baziResult: BaZiResult,
  birthDate: Date,
  config?: Partial<BaZiConfig>
): FortuneResult {
  const mergedConfig = mergeConfig(config);

  return withConfig(mergedConfig, () => {
    return computeFortune(baziResult, birthDate, mergedConfig);
  });
}

/**
 * 获取指定年份的流年信息
 *
 * @param baziResult - 八字排盘结果
 * @param birthDate - 出生日期
 * @param targetYear - 目标年份
 * @param config - 可选配置
 * @returns 流年信息
 */
export function getAnnualFortuneByYear(
  baziResult: BaZiResult,
  birthDate: Date,
  targetYear: number,
  config?: Partial<BaZiConfig>
): AnnualFortuneInfo | null {
  const mergedConfig = mergeConfig(config);

  return withConfig(mergedConfig, () => {
    const childLimit = getTymeChildLimit(birthDate, baziResult.gender);
    const dayPillar = baziResult.pillars.day.sixtyCycle;
    const dayHeavenStem = SixtyCycle.fromName(dayPillar).getHeavenStem();
    const birthYear = birthDate.getFullYear();

    return getAnnualFortune(childLimit, dayHeavenStem, targetYear, birthYear);
  });
}

/**
 * 获取流年列表
 *
 * @param baziResult - 八字排盘结果
 * @param birthDate - 出生日期
 * @param startYear - 起始年份
 * @param endYear - 结束年份
 * @param config - 可选配置
 * @returns 流年列表
 */
export function getAnnualFortuneRange(
  baziResult: BaZiResult,
  birthDate: Date,
  startYear: number,
  endYear: number,
  config?: Partial<BaZiConfig>
): AnnualFortuneInfo[] {
  const mergedConfig = mergeConfig(config);

  return withConfig(mergedConfig, () => {
    const childLimit = getTymeChildLimit(birthDate, baziResult.gender);
    const dayPillar = baziResult.pillars.day.sixtyCycle;
    const dayHeavenStem = SixtyCycle.fromName(dayPillar).getHeavenStem();
    const birthYear = birthDate.getFullYear();

    return getAnnualFortuneList(childLimit, dayHeavenStem, startYear, endYear, birthYear);
  });
}

/**
 * 内部计算函数
 */
function computeFortune(
  baziResult: BaZiResult,
  birthDate: Date,
  config: BaZiConfig
): FortuneResult {
  const birthYear = birthDate.getFullYear();
  const gender = baziResult.gender;

  // 获取童限
  const childLimitResult = computeChildLimit(birthDate, gender);

  // 获取 tyme4ts 的 ChildLimit 对象
  const tymeChildLimit = getTymeChildLimit(birthDate, gender);

  // 获取日干
  const dayPillar = baziResult.pillars.day.sixtyCycle;
  const dayHeavenStem = SixtyCycle.fromName(dayPillar).getHeavenStem();

  // 构建大运列表
  const decades = buildDecadeList(
    tymeChildLimit,
    dayHeavenStem,
    config.decadeCount,
    birthYear
  );

  // 获取当前流年（当前年份）
  const currentYear = new Date().getFullYear();
  const currentAnnual = getAnnualFortune(
    tymeChildLimit,
    dayHeavenStem,
    currentYear,
    birthYear
  ) || undefined;

  return {
    childLimit: childLimitResult,
    decades,
    currentAnnual,
  };
}
