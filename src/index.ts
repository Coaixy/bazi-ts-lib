/**
 * bazi-ts-lib - 八字排盘 TypeScript 库
 *
 * 基于 tyme4ts 构建，支持：
 * - 早晚子时切换
 * - 大运流年计算
 * - 纳音五行
 * - 神煞系统
 * - 格局分析
 * - 用神判定
 *
 * @example
 * ```typescript
 * import { getBaZi, getFortune, getShenSha, getPattern, getYongShen } from "bazi-ts-lib";
 *
 * // 基础排盘
 * const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
 * console.log(bazi.pillars.day.sixtyCycle);  // 日柱
 * console.log(bazi.pillars.year.sound);      // 年柱纳音
 *
 * // 大运流年
 * const fortune = getFortune(bazi, new Date("1990-05-15 10:30"));
 * console.log(fortune.childLimit.startAge);  // 起运虚岁
 * console.log(fortune.decades[0].sixtyCycle); // 第一步大运
 *
 * // 神煞
 * const shensha = getShenSha(bazi);
 * console.log(shensha.yearShenSha);
 *
 * // 格局
 * const pattern = getPattern(bazi);
 * console.log(pattern.name);
 *
 * // 用神
 * const yongShen = getYongShen(bazi);
 * console.log(yongShen.yongShen, yongShen.jiShen);
 * ```
 */

// ============ 核心类型导出 ============
export type {
  // 基础类型
  WuXingType,
  YinYangType,
  Gender,
  TenStarType,
  TerrainType,
  WangXiangType,
  HideHeavenStemTypeStr,
  // 天干地支
  HeavenStemInfo,
  EarthBranchInfo,
  HideHeavenStemInfo,
  // 四柱
  PillarInfo,
  FourPillars,
  // 特殊宫位
  SpecialSigns,
  // 结果
  BaZiResult,
  // 配置
  BaZiConfig,
} from "./core/type";

export { DEFAULT_CONFIG } from "./core/type";

// ============ 核心排盘函数 ============
export { getBaZi, getBaZiBySiZhu } from "./core/bazi";

// ============ 大运流年 ============
export type {
  ChildLimitResult,
  DecadeFortuneInfo,
  AnnualFortuneInfo,
  FortuneResult,
} from "./fortune/type";

export {
  getFortune,
  getAnnualFortuneByYear,
  getAnnualFortuneRange,
} from "./fortune";

// ============ 神煞系统 ============
export type {
  ShenShaItem,
  ShenShaList,
  TabooItem,
  ShenShaResult,
  PillarPosition,
} from "./shensha/type";

export {
  getShenSha,
  getAllShenSha,
  hasShenSha,
  getAuspiciousShenSha,
  getInauspiciousShenSha,
  findShenShaByName,
  getShenShaStats,
  getCompleteShenSha,
} from "./shensha";

// ============ 格局分析 ============
export type {
  PatternName,
  ZhengGeName,
  SpecialPatternName,
  PatternResult,
} from "./pattern/type";

export { getPattern, checkCongGe } from "./pattern";

// ============ 用神分析 ============
export type {
  WuXingScore,
  WuXingAnalysis,
  DayMasterStrength,
  YongShenResult,
  ScoreWeights,
} from "./yongShen/type";

export {
  getYongShen,
  getWuXingFavorability,
  analyzeWuXingStrength,
} from "./yongShen";

// ============ 映射数据 ============
export {
  TIAN_GAN,
  DI_ZHI,
  SIXTY_JIA_ZI,
  TIAN_GAN_WU_XING,
  DI_ZHI_WU_XING,
  TIAN_GAN_YIN_YANG,
  DI_ZHI_YIN_YANG,
} from "./maps/ganZhi";

export {
  WU_XING_SHENG,
  WU_XING_KE,
  getWangXiang,
} from "./maps/wuXing";

// ============ 聚合函数 ============

import { BaZiResult, BaZiConfig, Gender } from "./core/type";
import { getBaZi } from "./core/bazi";
import { getFortune, FortuneResult } from "./fortune";
import { getShenSha, ShenShaResult } from "./shensha";
import { getPattern, PatternResult } from "./pattern";
import { getYongShen, YongShenResult } from "./yongShen";

/** 完整八字分析结果 */
export interface FullBaZiResult {
  /** 八字排盘 */
  bazi: BaZiResult;
  /** 大运流年 */
  fortune: FortuneResult;
  /** 神煞 */
  shenSha: ShenShaResult;
  /** 格局 */
  pattern: PatternResult;
  /** 用神 */
  yongShen: YongShenResult;
}

/**
 * 一键获取完整八字分析
 *
 * @param birthDate - 出生日期
 * @param gender - 性别
 * @param config - 配置选项
 * @returns 完整八字分析结果
 *
 * @example
 * ```typescript
 * const result = getFullBaZi(new Date("1990-05-15 10:30"), "男");
 * console.log(result.bazi.pillars);
 * console.log(result.fortune.decades);
 * console.log(result.pattern.name);
 * console.log(result.yongShen.yongShen);
 * ```
 */
export function getFullBaZi(
  birthDate: Date,
  gender: Gender,
  config?: Partial<BaZiConfig>
): FullBaZiResult {
  // 获取八字
  const bazi = getBaZi(birthDate, gender, config);

  // 获取大运流年
  const fortune = getFortune(bazi, birthDate, config);

  // 获取神煞
  const shenSha = getShenSha(bazi);

  // 获取格局
  const pattern = getPattern(bazi);

  // 获取用神
  const yongShen = getYongShen(bazi);

  return {
    bazi,
    fortune,
    shenSha,
    pattern,
    yongShen,
  };
}

// ============ 调试输出（开发时使用） ============

// 简单测试
if (typeof process !== "undefined" && process.argv?.[1]?.includes("index.ts")) {
  const testDate = new Date("1990-05-15 10:30");
  const result = getFullBaZi(testDate, "男");

  console.log("=== 八字排盘测试 ===");
  console.log("出生时间:", result.bazi.birthTime);
  console.log("八字:", result.bazi.baziString);
  console.log("日柱:", result.bazi.pillars.day.sixtyCycle);
  console.log("日柱纳音:", result.bazi.pillars.day.sound);
  console.log("命宫:", result.bazi.specialSigns.ownSign);
  console.log("空亡:", result.bazi.specialSigns.kongWang.join(", "));
  console.log("");
  console.log("=== 大运 ===");
  console.log("起运虚岁:", result.fortune.childLimit.startAge);
  console.log("前三步大运:", result.fortune.decades.slice(0, 3).map(d => d.sixtyCycle).join(" -> "));
  console.log("");
  console.log("=== 格局 ===");
  console.log("格局:", result.pattern.name);
  console.log("描述:", result.pattern.description);
  console.log("");
  console.log("=== 用神 ===");
  console.log("用神:", result.yongShen.yongShen);
  console.log("忌神:", result.yongShen.jiShen);
  console.log("判断:", result.yongShen.reason);
}
