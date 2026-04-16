/**
 * 八字排盘核心类型定义
 */

// ============ 基础原子类型 ============

/** 五行 */
export type WuXingType = "木" | "火" | "土" | "金" | "水";

/** 阴阳 */
export type YinYangType = "阴" | "阳";

/** 性别 */
export type Gender = "男" | "女";

/** 十神 */
export type TenStarType =
  | "比肩" | "劫财" | "食神" | "伤官"
  | "偏财" | "正财" | "七杀" | "正官"
  | "偏印" | "正印";

/** 十二长生 */
export type TerrainType =
  | "长生" | "沐浴" | "冠带" | "临官"
  | "帝旺" | "衰" | "病" | "死"
  | "墓" | "绝" | "胎" | "养";

/** 旺相休囚死 */
export type WangXiangType = "旺" | "相" | "休" | "囚" | "死";

/** 藏干类型 */
export type HideHeavenStemTypeStr = "主气" | "中气" | "余气";

// ============ 天干地支 ============

/** 天干详情 */
export interface HeavenStemInfo {
  /** 天干名：甲乙丙丁戊己庚辛壬癸 */
  name: string;
  /** 五行 */
  element: WuXingType;
  /** 阴阳 */
  yinYang: YinYangType;
}

/** 藏干详情 */
export interface HideHeavenStemInfo {
  /** 藏干天干名 */
  name: string;
  /** 藏干类型：主气/中气/余气 */
  type: HideHeavenStemTypeStr;
  /** 五行 */
  element: WuXingType;
}

/** 地支详情 */
export interface EarthBranchInfo {
  /** 地支名：子丑寅卯辰巳午未申酉戌亥 */
  name: string;
  /** 五行 */
  element: WuXingType;
  /** 阴阳 */
  yinYang: YinYangType;
  /** 藏干列表 */
  hideHeavenStems: HideHeavenStemInfo[];
}

// ============ 四柱详情 ============

/** 单柱详情 */
export interface PillarInfo {
  /** 干支名：如"甲子" */
  sixtyCycle: string;
  /** 天干 */
  heavenStem: HeavenStemInfo;
  /** 地支 */
  earthBranch: EarthBranchInfo;
  /** 纳音：如"海中金" */
  sound: string;
  /** 十神（以日干为主，年柱天干十神为日干对年干关系） */
  tenStar: TenStarType | null;
  /** 十二长生（日干在该柱地支的长生状态） */
  terrain: TerrainType;
  /** 月令旺相休囚死 */
  wangXiang: WangXiangType;
}

/** 四柱（八字）核心数据 */
export interface FourPillars {
  /** 年柱 */
  year: PillarInfo;
  /** 月柱 */
  month: PillarInfo;
  /** 日柱 */
  day: PillarInfo;
  /** 时柱 */
  hour: PillarInfo;
}

// ============ 特殊宫位 ============

/** 特殊宫位信息 */
export interface SpecialSigns {
  /** 胎元（干支） */
  fetalOrigin: string;
  /** 胎息（干支） */
  fetalBreath: string;
  /** 命宫（干支） */
  ownSign: string;
  /** 身宫（干支） */
  bodySign: string;
  /** 建除十二值：如"建" */
  duty: string;
  /** 空亡（两个地支） */
  kongWang: string[];
  /** 旬首 */
  xun: string;
}

// ============ 排盘结果 ============

/** 八字排盘完整结果 */
export interface BaZiResult {
  /** 出生时间描述："2000年01月01日 子时" */
  birthTime: string;
  /** 性别 */
  gender: Gender;
  /** 四柱 */
  pillars: FourPillars;
  /** 特殊宫位 */
  specialSigns: SpecialSigns;
  /** 原始八字字符串，如"甲子 乙丑 丙寅 丁卯" */
  baziString: string;
}

// ============ 配置系统 ============

/** 排盘配置 */
export interface BaZiConfig {
  /**
   * 子时切换：
   * - "early"  早子时（默认，23:00~00:00 算次日）
   * - "late"   晚子时（23:00~00:00 算当日）
   */
  zishiMode: "early" | "late";

  /**
   * 起运算法：
   * - "default"     标准3天=1年（精确到分）
   * - "china95"     China95算法
   * - "lunar_sect1" 农历派1
   * - "lunar_sect2" 农历派2
   */
  childLimitMode: "default" | "china95" | "lunar_sect1" | "lunar_sect2";

  /** 大运数量，默认 10 */
  decadeCount: number;
}

/** 默认配置 */
export const DEFAULT_CONFIG: BaZiConfig = {
  zishiMode: "early",
  childLimitMode: "default",
  decadeCount: 10,
};
