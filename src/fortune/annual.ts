/**
 * 流年计算模块
 */

import { ChildLimit, HeavenStem, EarthBranch, SixtyCycle } from "tyme4ts";
import { AnnualFortuneInfo } from "./type";
import { TenStarType, TerrainType } from "../core/type";

/**
 * 获取指定年份的流年信息
 *
 * @param childLimit - tyme4ts 的 ChildLimit 对象
 * @param dayHeavenStem - 日干
 * @param targetYear - 目标公历年份
 * @param birthYear - 出生年份
 * @returns 流年信息
 */
export function getAnnualFortune(
  childLimit: ChildLimit,
  dayHeavenStem: HeavenStem,
  targetYear: number,
  birthYear: number
): AnnualFortuneInfo | null {
  // 计算虚岁
  const age = targetYear - birthYear + 1;
  if (age < 1) {
    return null;
  }

  const sixtyCycle = SixtyCycle.fromIndex(
    ((targetYear - 1984) % 60 + 60) % 60
  );
  const stem = sixtyCycle.getHeavenStem();
  const branch = sixtyCycle.getEarthBranch();

  return {
    sixtyCycle: sixtyCycle.getName(),
    heavenStem: stem.getName(),
    earthBranch: branch.getName(),
    sound: sixtyCycle.getSound().getName(),
    year: targetYear,
    lunarYear: `${sixtyCycle.getName()}年`,
    age,
    tenStar: getTenStarName(dayHeavenStem, stem),
    terrain: getTerrainName(dayHeavenStem, branch),
  };
}

/**
 * 获取流年列表
 *
 * @param childLimit - tyme4ts 的 ChildLimit 对象
 * @param dayHeavenStem - 日干
 * @param startYear - 起始公历年份
 * @param endYear - 结束公历年份
 * @param birthYear - 出生年份
 * @returns 流年列表
 */
export function getAnnualFortuneList(
  childLimit: ChildLimit,
  dayHeavenStem: HeavenStem,
  startYear: number,
  endYear: number,
  birthYear: number
): AnnualFortuneInfo[] {
  const result: AnnualFortuneInfo[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const annual = getAnnualFortune(childLimit, dayHeavenStem, year, birthYear);
    if (annual) {
      result.push(annual);
    }
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
