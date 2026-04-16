/**
 * 五行力量评分模块
 */

import { WuXingScore, WuXingAnalysis, DayMasterStrength, ScoreWeights, DEFAULT_SCORE_WEIGHTS } from "./type";
import { BaZiResult, WuXingType, WangXiangType, HideHeavenStemTypeStr } from "../core/type";
import { getWangXiang, MONTH_BRANCH_ELEMENT } from "../maps/wuXing";

/** 五行列表 */
const WU_XING_LIST: WuXingType[] = ["木", "火", "土", "金", "水"];

/** 旺相休囚死对应的权重倍数 */
const WANG_XIANG_MULTIPLIER: Record<WangXiangType, number> = {
  "旺": 2.0,
  "相": 1.5,
  "休": 0.8,
  "囚": 0.5,
  "死": 0.3,
};

/**
 * 计算五行力量分析
 *
 * @param baziResult - 八字排盘结果
 * @param weights - 评分权重配置（可选）
 * @returns 五行力量分析结果
 */
export function analyzeWuXingStrength(
  baziResult: BaZiResult,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): WuXingAnalysis {
  const { pillars } = baziResult;

  // 获取月令五行
  const monthBranchName = pillars.month.earthBranch.name;
  const monthElement = MONTH_BRANCH_ELEMENT[monthBranchName] || "土";

  // 初始化五行计分
  const scoreMap: Record<WuXingType, { score: number; count: number }> = {
    "木": { score: 0, count: 0 },
    "火": { score: 0, count: 0 },
    "土": { score: 0, count: 0 },
    "金": { score: 0, count: 0 },
    "水": { score: 0, count: 0 },
  };

  // 遍历四柱计算得分
  const pillarList = [pillars.year, pillars.month, pillars.day, pillars.hour];
  const isMonthPillar = [false, true, false, false];

  for (let i = 0; i < pillarList.length; i++) {
    const pillar = pillarList[i];
    const isMonth = isMonthPillar[i];
    const multiplier = isMonth ? weights.monthMultiplier : 1;

    // 天干得分
    const stemElement = pillar.heavenStem.element;
    scoreMap[stemElement].score += weights.heavenStemBase * multiplier;
    scoreMap[stemElement].count++;

    // 地支藏干得分
    for (const hideStem of pillar.earthBranch.hideHeavenStems) {
      const hideElement = hideStem.element;
      const hideScore = getHideStemScore(hideStem.type, weights);
      scoreMap[hideElement].score += hideScore * multiplier;
      scoreMap[hideElement].count++;
    }
  }

  // 应用旺相休囚死权重
  const scores: WuXingScore[] = WU_XING_LIST.map(element => {
    const wangXiang = getWangXiang(element, monthElement);
    const baseScore = scoreMap[element].score;
    const adjustedScore = baseScore * WANG_XIANG_MULTIPLIER[wangXiang];

    return {
      element,
      score: Math.round(adjustedScore * 10) / 10, // 保留一位小数
      wangXiang,
      count: scoreMap[element].count,
    };
  });

  // 获取日主五行
  const dayMasterElement = pillars.day.heavenStem.element;
  const dayMasterScore = scores.find(s => s.element === dayMasterElement)!;

  // 计算日主强弱
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const avgScore = totalScore / 5;
  const dayMasterStrength = determineDayMasterStrength(dayMasterScore.score, avgScore);

  // 找出最强和最弱五行
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const dominantElement = sortedScores[0].element;
  const weakestElement = sortedScores[sortedScores.length - 1].element;

  return {
    scores,
    dayMasterElement,
    dayMasterStrength,
    dominantElement,
    weakestElement,
  };
}

/**
 * 获取藏干得分
 */
function getHideStemScore(type: HideHeavenStemTypeStr, weights: ScoreWeights): number {
  switch (type) {
    case "主气":
      return weights.earthBranchMain;
    case "中气":
      return weights.earthBranchMiddle;
    case "余气":
      return weights.earthBranchResidual;
    default:
      return weights.earthBranchResidual;
  }
}

/**
 * 判断日主强弱
 */
function determineDayMasterStrength(dayMasterScore: number, avgScore: number): DayMasterStrength {
  const ratio = dayMasterScore / avgScore;

  if (ratio > 1.3) {
    return "强";
  } else if (ratio < 0.7) {
    return "弱";
  } else {
    return "中和";
  }
}
