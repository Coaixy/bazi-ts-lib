/**
 * 大运计算模块
 */

import { ChildLimit, DecadeFortune, HeavenStem, EarthBranch } from "tyme4ts";
import { DecadeFortuneInfo } from "./type";
import { TenStarType, TerrainType, WuXingType } from "../core/type";

/**
 * 从 ChildLimit 构建大运列表
 *
 * @param childLimit - tyme4ts 的 ChildLimit 对象
 * @param dayHeavenStem - 日干（用于计算十神和长生）
 * @param count - 大运数量，默认 10
 * @param birthYear - 出生年份
 * @returns 大运列表
 */
export function buildDecadeList(
  childLimit: ChildLimit,
  dayHeavenStem: HeavenStem,
  count: number,
  birthYear: number
): DecadeFortuneInfo[] {
  const result: DecadeFortuneInfo[] = [];
  const startDecade = childLimit.getStartDecadeFortune();

  // 起运虚岁
  const startAge = childLimit.getYearCount() + 1;

  for (let i = 0; i < count; i++) {
    const decade = i === 0 ? startDecade : (startDecade.next(i) as DecadeFortune);
    const sixtyCycle = decade.getSixtyCycle();
    const stem = sixtyCycle.getHeavenStem();
    const branch = sixtyCycle.getEarthBranch();

    // 计算这步大运的起止岁数
    const decadeStartAge = startAge + i * 10;
    const decadeEndAge = decadeStartAge + 9;

    // 计算对应的公历年份
    const decadeStartYear = birthYear + decadeStartAge - 1;
    const decadeEndYear = birthYear + decadeEndAge - 1;

    result.push({
      index: i,
      sixtyCycle: sixtyCycle.getName(),
      heavenStem: stem.getName(),
      earthBranch: branch.getName(),
      sound: sixtyCycle.getSound().getName(),
      startAge: decadeStartAge,
      endAge: decadeEndAge,
      startYear: decadeStartYear,
      endYear: decadeEndYear,
      tenStar: getTenStarName(dayHeavenStem, stem),
      terrain: getTerrainName(dayHeavenStem, branch),
      element: stem.getElement().getName() as WuXingType,
    });
  }

  return result;
}

/**
 * 获取十神名称
 */
function getTenStarName(dayStem: HeavenStem, targetStem: HeavenStem): TenStarType {
  const tenStar = dayStem.getTenStar(targetStem);
  return tenStar.getName() as TenStarType;
}

/**
 * 获取十二长生名称
 */
function getTerrainName(dayStem: HeavenStem, branch: EarthBranch): TerrainType {
  const terrain = dayStem.getTerrain(branch);
  return terrain.getName() as TerrainType;
}
