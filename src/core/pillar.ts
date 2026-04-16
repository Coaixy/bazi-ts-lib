/**
 * 四柱构建模块 - 封装 tyme4ts 的 SixtyCycle 转换为 PillarInfo
 */

import {
  SixtyCycle,
  HeavenStem,
  EarthBranch,
  HideHeavenStemType,
  EightChar,
  YinYang,
} from "tyme4ts";
import {
  PillarInfo,
  HeavenStemInfo,
  EarthBranchInfo,
  HideHeavenStemInfo,
  TenStarType,
  TerrainType,
  WuXingType,
  YinYangType,
  WangXiangType,
  HideHeavenStemTypeStr,
} from "./type";
import { getWangXiang, MONTH_BRANCH_ELEMENT } from "../maps/wuXing";

/**
 * 转换 tyme4ts 的 YinYang 枚举到本库的 YinYangType
 */
function convertYinYang(yinYang: YinYang): YinYangType {
  return yinYang === YinYang.YANG ? "阳" : "阴";
}

/**
 * 转换 tyme4ts 的 Element 到本库的 WuXingType
 */
function convertElement(element: { getName: () => string }): WuXingType {
  return element.getName() as WuXingType;
}

/**
 * 转换藏干类型
 */
function convertHideType(type: HideHeavenStemType): HideHeavenStemTypeStr {
  switch (type) {
    case HideHeavenStemType.MAIN:
      return "主气";
    case HideHeavenStemType.MIDDLE:
      return "中气";
    case HideHeavenStemType.RESIDUAL:
      return "余气";
    default:
      return "主气";
  }
}

/**
 * 构建天干信息
 */
export function buildHeavenStemInfo(stem: HeavenStem): HeavenStemInfo {
  return {
    name: stem.getName(),
    element: convertElement(stem.getElement()),
    yinYang: convertYinYang(stem.getYinYang()),
  };
}

/**
 * 构建藏干信息列表
 */
export function buildHideHeavenStemsInfo(branch: EarthBranch): HideHeavenStemInfo[] {
  const hideStems = branch.getHideHeavenStems();
  return hideStems.map((hs) => ({
    name: hs.getHeavenStem().getName(),
    type: convertHideType(hs.getType()),
    element: convertElement(hs.getHeavenStem().getElement()),
  }));
}

/**
 * 构建地支信息
 */
export function buildEarthBranchInfo(branch: EarthBranch): EarthBranchInfo {
  return {
    name: branch.getName(),
    element: convertElement(branch.getElement()),
    yinYang: convertYinYang(branch.getYinYang()),
    hideHeavenStems: buildHideHeavenStemsInfo(branch),
  };
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

/**
 * 构建单柱信息
 *
 * @param sixtyCycle - 干支对象
 * @param dayHeavenStem - 日干（用于计算十神和长生）
 * @param monthBranch - 月支（用于计算旺相休囚死）
 * @param isDayPillar - 是否为日柱（日柱十神为 null）
 */
export function buildPillarInfo(
  sixtyCycle: SixtyCycle,
  dayHeavenStem: HeavenStem,
  monthBranch: EarthBranch,
  isDayPillar: boolean = false
): PillarInfo {
  const stem = sixtyCycle.getHeavenStem();
  const branch = sixtyCycle.getEarthBranch();
  const sound = sixtyCycle.getSound();

  // 获取月令五行
  const monthElement = MONTH_BRANCH_ELEMENT[monthBranch.getName()] || "土";
  // 该柱天干的五行
  const stemElement = convertElement(stem.getElement());

  return {
    sixtyCycle: sixtyCycle.getName(),
    heavenStem: buildHeavenStemInfo(stem),
    earthBranch: buildEarthBranchInfo(branch),
    sound: sound.getName(),
    tenStar: isDayPillar ? null : getTenStarName(dayHeavenStem, stem),
    terrain: getTerrainName(dayHeavenStem, branch),
    wangXiang: getWangXiang(stemElement, monthElement),
  };
}

/**
 * 从 EightChar 构建四柱信息
 */
export function buildFourPillars(eightChar: EightChar) {
  const yearSC = eightChar.getYear();
  const monthSC = eightChar.getMonth();
  const daySC = eightChar.getDay();
  const hourSC = eightChar.getHour();

  const dayHeavenStem = daySC.getHeavenStem();
  const monthBranch = monthSC.getEarthBranch();

  return {
    year: buildPillarInfo(yearSC, dayHeavenStem, monthBranch),
    month: buildPillarInfo(monthSC, dayHeavenStem, monthBranch),
    day: buildPillarInfo(daySC, dayHeavenStem, monthBranch, true),
    hour: buildPillarInfo(hourSC, dayHeavenStem, monthBranch),
  };
}
