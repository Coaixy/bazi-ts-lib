/**
 * 大运流年类型定义
 */

import { WuXingType, TenStarType, TerrainType } from "../core/type";

/** 童限（起运）信息 */
export interface ChildLimitResult {
  /** 起运虚岁 */
  startAge: number;
  /** 起运年数 */
  yearCount: number;
  /** 起运月数 */
  monthCount: number;
  /** 起运日数 */
  dayCount: number;
  /** 起运公历时间 */
  startTime: string;
  /** 是否顺行（男阳女阴顺行，男阴女阳逆行） */
  isForward: boolean;
}

/** 单步大运详情 */
export interface DecadeFortuneInfo {
  /** 第几步大运（从 0 开始） */
  index: number;
  /** 大运干支 */
  sixtyCycle: string;
  /** 天干 */
  heavenStem: string;
  /** 地支 */
  earthBranch: string;
  /** 纳音 */
  sound: string;
  /** 起运岁数（虚岁） */
  startAge: number;
  /** 终运岁数（虚岁） */
  endAge: number;
  /** 起运公历年 */
  startYear: number;
  /** 终运公历年 */
  endYear: number;
  /** 天干十神（相对于日主） */
  tenStar: TenStarType;
  /** 地支长生（日干在该地支的状态） */
  terrain: TerrainType;
  /** 大运五行（天干五行） */
  element: WuXingType;
}

/** 单步流年详情 */
export interface AnnualFortuneInfo {
  /** 流年干支 */
  sixtyCycle: string;
  /** 天干 */
  heavenStem: string;
  /** 地支 */
  earthBranch: string;
  /** 纳音 */
  sound: string;
  /** 公历年 */
  year: number;
  /** 农历年描述（如"甲子年"） */
  lunarYear: string;
  /** 虚岁 */
  age: number;
  /** 天干十神 */
  tenStar: TenStarType;
  /** 地支长生 */
  terrain: TerrainType;
}

/** 大运流年完整结果 */
export interface FortuneResult {
  /** 童限（起运）信息 */
  childLimit: ChildLimitResult;
  /** 大运列表 */
  decades: DecadeFortuneInfo[];
  /** 当前流年（可选，传入当前年份时计算） */
  currentAnnual?: AnnualFortuneInfo;
}
