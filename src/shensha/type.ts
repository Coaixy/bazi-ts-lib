/**
 * 神煞系统类型定义
 */

/** 神煞来源柱位 */
export type PillarPosition = "年" | "月" | "日" | "时";

/** 神煞项 */
export interface ShenShaItem {
  /** 神煞名称 */
  name: string;
  /** 所在地支或干支 */
  value: string;
  /** 来源柱位 */
  pillar: PillarPosition;
  /** 是否吉神 */
  isGood: boolean;
  /** 描述（可选） */
  description?: string;
}

/** 神煞列表 */
export type ShenShaList = ShenShaItem[];

/** 宜忌项 */
export interface TabooItem {
  /** 宜忌事项名称 */
  name: string;
  /** 是否为"宜"（true=宜，false=忌） */
  isRecommend: boolean;
}

/** 神煞宜忌完整结果 */
export interface ShenShaResult {
  /** 年柱神煞 */
  yearShenSha: ShenShaList;
  /** 日柱神煞（基于 tyme4ts God） */
  dayShenSha: ShenShaList;
  /** 时柱神煞 */
  hourShenSha: ShenShaList;
  /** 当日宜 */
  dayRecommends: TabooItem[];
  /** 当日忌 */
  dayAvoids: TabooItem[];
}
