/**
 * 日柱神煞模块 - 封装 tyme4ts 的 God API
 */

import { God, SixtyCycle } from "tyme4ts";
import { ShenShaItem, ShenShaList } from "./type";

/**
 * 获取日柱神煞
 *
 * @param monthPillar - 月柱干支
 * @param dayPillar - 日柱干支
 * @returns 神煞列表
 */
export function getDayShenSha(monthPillar: string, dayPillar: string): ShenShaList {
  try {
    const monthSC = SixtyCycle.fromName(monthPillar);
    const daySC = SixtyCycle.fromName(dayPillar);

    // 使用 tyme4ts 获取当日神煞
    const gods = God.getDayGods(monthSC, daySC);

    return gods.map((god): ShenShaItem => ({
      name: god.getName(),
      value: dayPillar,
      pillar: "日",
      isGood: god.getLuck().getName() === "吉", // 通过名称判断吉凶
      description: undefined,
    }));
  } catch {
    // 如果解析失败，返回空列表
    return [];
  }
}

/**
 * 获取常见吉神列表
 */
export function getCommonAuspiciousGods(): string[] {
  return [
    "天德", "月德", "天德合", "月德合",
    "天乙贵人", "太极贵人", "三奇贵人",
    "天官贵人", "福星贵人", "文昌贵人",
    "驿马", "将星", "华盖",
    "天医", "金舆", "禄神",
  ];
}

/**
 * 获取常见凶神列表
 */
export function getCommonInauspiciousGods(): string[] {
  return [
    "劫煞", "灾煞", "亡神",
    "羊刃", "飞刃", "血刃",
    "孤辰", "寡宿", "空亡",
    "丧门", "吊客", "天狗",
    "白虎", "朱雀", "玄武",
  ];
}
