/**
 * 神煞系统模块入口
 */

import { ShenShaResult, TabooItem, ShenShaList } from "./type";
import { BaZiResult } from "../core/type";
import { getDayShenSha } from "./dayShensha";
import { getCompleteShenSha, getYearShenSha } from "./yearShensha";

export * from "./type";
export * from "./shenshaRules";

/**
 * 获取八字神煞信息（完整版）
 *
 * @param baziResult - 八字排盘结果
 * @returns 神煞宜忌结果
 *
 * @example
 * ```typescript
 * const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
 * const shensha = getShenSha(bazi);
 * console.log(shensha.yearShenSha);  // 年柱神煞
 * console.log(shensha.dayShenSha);   // 日柱神煞
 * ```
 */
export function getShenSha(baziResult: BaZiResult): ShenShaResult {
  const { pillars } = baziResult;

  // 提取四柱干支信息
  const info = {
    yearStem: pillars.year.heavenStem.name,
    yearBranch: pillars.year.earthBranch.name,
    monthStem: pillars.month.heavenStem.name,
    monthBranch: pillars.month.earthBranch.name,
    dayStem: pillars.day.heavenStem.name,
    dayBranch: pillars.day.earthBranch.name,
    hourStem: pillars.hour.heavenStem.name,
    hourBranch: pillars.hour.earthBranch.name,
    dayPillar: pillars.day.sixtyCycle,
    allStems: [
      pillars.year.heavenStem.name,
      pillars.month.heavenStem.name,
      pillars.day.heavenStem.name,
      pillars.hour.heavenStem.name,
    ],
    allBranches: [
      pillars.year.earthBranch.name,
      pillars.month.earthBranch.name,
      pillars.day.earthBranch.name,
      pillars.hour.earthBranch.name,
    ],
  };

  // 获取完整神煞列表
  const allShenSha = getCompleteShenSha(info);

  // 按柱位分类
  const yearShenSha = allShenSha.filter(s => s.pillar === "年");
  const monthShenSha = allShenSha.filter(s => s.pillar === "月");
  const dayShenSha = allShenSha.filter(s => s.pillar === "日");
  const hourShenSha = allShenSha.filter(s => s.pillar === "时");

  // 获取 tyme4ts 的日柱神煞（基于月柱和日柱）
  const tymeDayShenSha = getDayShenSha(
    pillars.month.sixtyCycle,
    pillars.day.sixtyCycle
  );

  // 合并日柱神煞（去重）
  const combinedDayShenSha = mergeShenSha(dayShenSha, tymeDayShenSha);

  // 宜忌暂时返回空
  const dayRecommends: TabooItem[] = [];
  const dayAvoids: TabooItem[] = [];

  return {
    yearShenSha: [...yearShenSha, ...monthShenSha], // 年月合并到年柱
    dayShenSha: combinedDayShenSha,
    hourShenSha,
    dayRecommends,
    dayAvoids,
  };
}

/**
 * 获取完整的神煞列表（不分柱位）
 *
 * @param baziResult - 八字排盘结果
 * @returns 所有神煞列表
 */
export function getAllShenSha(baziResult: BaZiResult): ShenShaList {
  const { pillars } = baziResult;

  const info = {
    yearStem: pillars.year.heavenStem.name,
    yearBranch: pillars.year.earthBranch.name,
    monthStem: pillars.month.heavenStem.name,
    monthBranch: pillars.month.earthBranch.name,
    dayStem: pillars.day.heavenStem.name,
    dayBranch: pillars.day.earthBranch.name,
    hourStem: pillars.hour.heavenStem.name,
    hourBranch: pillars.hour.earthBranch.name,
    dayPillar: pillars.day.sixtyCycle,
    allStems: [
      pillars.year.heavenStem.name,
      pillars.month.heavenStem.name,
      pillars.day.heavenStem.name,
      pillars.hour.heavenStem.name,
    ],
    allBranches: [
      pillars.year.earthBranch.name,
      pillars.month.earthBranch.name,
      pillars.day.earthBranch.name,
      pillars.hour.earthBranch.name,
    ],
  };

  const allShenSha = getCompleteShenSha(info);

  // 获取 tyme4ts 的日柱神煞
  const tymeDayShenSha = getDayShenSha(
    pillars.month.sixtyCycle,
    pillars.day.sixtyCycle
  );

  return mergeShenSha(allShenSha, tymeDayShenSha);
}

/**
 * 合并两个神煞列表并去重
 */
function mergeShenSha(list1: ShenShaList, list2: ShenShaList): ShenShaList {
  const result = [...list1];
  const existingNames = new Set(list1.map(s => s.name + s.value));

  for (const item of list2) {
    const key = item.name + item.value;
    if (!existingNames.has(key)) {
      result.push(item);
      existingNames.add(key);
    }
  }

  return result;
}

/**
 * 获取特定神煞是否存在
 *
 * @param shenShaResult - 神煞结果
 * @param shenShaName - 神煞名称
 * @returns 是否存在该神煞
 */
export function hasShenSha(shenShaResult: ShenShaResult, shenShaName: string): boolean {
  const allShenSha = [
    ...shenShaResult.yearShenSha,
    ...shenShaResult.dayShenSha,
    ...shenShaResult.hourShenSha,
  ];
  return allShenSha.some(item => item.name === shenShaName);
}

/**
 * 获取所有吉神
 */
export function getAuspiciousShenSha(shenShaResult: ShenShaResult): ShenShaList {
  const allShenSha = [
    ...shenShaResult.yearShenSha,
    ...shenShaResult.dayShenSha,
    ...shenShaResult.hourShenSha,
  ];
  return allShenSha.filter(item => item.isGood);
}

/**
 * 获取所有凶神
 */
export function getInauspiciousShenSha(shenShaResult: ShenShaResult): ShenShaList {
  const allShenSha = [
    ...shenShaResult.yearShenSha,
    ...shenShaResult.dayShenSha,
    ...shenShaResult.hourShenSha,
  ];
  return allShenSha.filter(item => !item.isGood);
}

/**
 * 按神煞名称查询
 */
export function findShenShaByName(shenShaResult: ShenShaResult, name: string): ShenShaList {
  const allShenSha = [
    ...shenShaResult.yearShenSha,
    ...shenShaResult.dayShenSha,
    ...shenShaResult.hourShenSha,
  ];
  return allShenSha.filter(item => item.name.includes(name));
}

/**
 * 获取神煞统计
 */
export function getShenShaStats(shenShaResult: ShenShaResult): {
  total: number;
  auspicious: number;
  inauspicious: number;
  byPillar: Record<string, number>;
} {
  const allShenSha = [
    ...shenShaResult.yearShenSha,
    ...shenShaResult.dayShenSha,
    ...shenShaResult.hourShenSha,
  ];

  const byPillar: Record<string, number> = { "年": 0, "月": 0, "日": 0, "时": 0 };
  for (const item of allShenSha) {
    byPillar[item.pillar] = (byPillar[item.pillar] || 0) + 1;
  }

  return {
    total: allShenSha.length,
    auspicious: allShenSha.filter(s => s.isGood).length,
    inauspicious: allShenSha.filter(s => !s.isGood).length,
    byPillar,
  };
}

// 保留旧导出以兼容
export { getYearShenSha, getCompleteShenSha };
