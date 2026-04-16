/**
 * 用神分析类型定义
 */

import { WuXingType, WangXiangType } from "../core/type";

/** 五行力量评分 */
export interface WuXingScore {
  /** 五行 */
  element: WuXingType;
  /** 综合得分 */
  score: number;
  /** 旺相休囚死状态 */
  wangXiang: WangXiangType;
  /** 在八字中出现次数（含藏干） */
  count: number;
}

/** 日主强弱 */
export type DayMasterStrength = "强" | "弱" | "中和";

/** 五行强弱分析 */
export interface WuXingAnalysis {
  /** 五行评分列表 */
  scores: WuXingScore[];
  /** 日主五行 */
  dayMasterElement: WuXingType;
  /** 日主强弱 */
  dayMasterStrength: DayMasterStrength;
  /** 最强五行 */
  dominantElement: WuXingType;
  /** 最弱五行 */
  weakestElement: WuXingType;
}

/** 用神分析结果 */
export interface YongShenResult {
  /** 用神（最需要的五行） */
  yongShen: WuXingType;
  /** 忌神（最忌讳的五行） */
  jiShen: WuXingType;
  /** 喜神（辅助用神的五行） */
  xiShen: WuXingType;
  /** 仇神（辅助忌神的五行） */
  chouShen: WuXingType;
  /** 闲神（影响较小的五行） */
  xianShen: WuXingType;
  /** 五行强弱分析 */
  analysis: WuXingAnalysis;
  /** 判断依据说明 */
  reason: string;
}

/** 评分权重配置 */
export interface ScoreWeights {
  /** 天干基础分 */
  heavenStemBase: number;
  /** 地支主气分 */
  earthBranchMain: number;
  /** 地支中气分 */
  earthBranchMiddle: number;
  /** 地支余气分 */
  earthBranchResidual: number;
  /** 月令加成倍数 */
  monthMultiplier: number;
}

/** 默认评分权重 */
export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  heavenStemBase: 10,
  earthBranchMain: 8,
  earthBranchMiddle: 4,
  earthBranchResidual: 2,
  monthMultiplier: 1.5,
};
