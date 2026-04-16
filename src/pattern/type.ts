/**
 * 格局分析类型定义
 */

import { TenStarType, WuXingType } from "../core/type";

/** 正格名称 */
export type ZhengGeName =
  | "正官格" | "七杀格"
  | "正印格" | "偏印格"
  | "食神格" | "伤官格"
  | "正财格" | "偏财格";

/** 特殊格局名称 */
export type SpecialPatternName =
  | "建禄格" | "月刃格"
  | "从强格" | "从弱格"
  | "从财格" | "从杀格" | "从儿格"
  | "化气格"
  | "杂格";

/** 格局名称（全部） */
export type PatternName = ZhengGeName | SpecialPatternName;

/** 格局判断结果 */
export interface PatternResult {
  /** 格局名称 */
  name: PatternName;
  /** 是否特殊格（从格/化气格等） */
  isSpecial: boolean;
  /** 月令地支 */
  monthBranch: string;
  /** 月令主气十神 */
  monthMainTenStar: TenStarType;
  /** 月令五行 */
  monthElement: WuXingType;
  /** 格局描述 */
  description: string;
  /** 判断置信度 */
  reliability: "确定" | "参考";
}

/** 十神到正格的映射 */
export const TEN_STAR_TO_PATTERN: Record<TenStarType, ZhengGeName | null> = {
  "正官": "正官格",
  "七杀": "七杀格",
  "正印": "正印格",
  "偏印": "偏印格",
  "食神": "食神格",
  "伤官": "伤官格",
  "正财": "正财格",
  "偏财": "偏财格",
  "比肩": null, // 建禄格
  "劫财": null, // 月刃格
};
