/**
 * 五行关系映射数据
 */

import { WuXingType, WangXiangType } from "../core/type";

/** 五行相生关系：A 生 B */
export const WU_XING_SHENG: Record<WuXingType, WuXingType> = {
  "木": "火",
  "火": "土",
  "土": "金",
  "金": "水",
  "水": "木",
};

/** 五行相克关系：A 克 B */
export const WU_XING_KE: Record<WuXingType, WuXingType> = {
  "木": "土",
  "火": "金",
  "土": "水",
  "金": "木",
  "水": "火",
};

/** 被克关系：A 被 B 克 */
export const WU_XING_BEI_KE: Record<WuXingType, WuXingType> = {
  "木": "金",
  "火": "水",
  "土": "木",
  "金": "火",
  "水": "土",
};

/** 生我关系：A 被 B 生 */
export const WU_XING_SHENG_WO: Record<WuXingType, WuXingType> = {
  "木": "水",
  "火": "木",
  "土": "火",
  "金": "土",
  "水": "金",
};

/**
 * 月令旺相休囚死
 * 以月支五行为令，计算其他五行的状态
 * 旺：当令之五行
 * 相：旺所生之五行
 * 休：生旺之五行
 * 囚：克旺之五行
 * 死：旺所克之五行
 */
export function getWangXiang(element: WuXingType, monthElement: WuXingType): WangXiangType {
  if (element === monthElement) {
    return "旺"; // 当令
  }
  if (WU_XING_SHENG[monthElement] === element) {
    return "相"; // 旺所生
  }
  if (WU_XING_SHENG_WO[monthElement] === element) {
    return "休"; // 生旺者
  }
  if (WU_XING_BEI_KE[monthElement] === element) {
    return "囚"; // 克旺者
  }
  if (WU_XING_KE[monthElement] === element) {
    return "死"; // 旺所克
  }
  return "休"; // fallback
}

/** 月支对应的月令五行（按地支五行取） */
export const MONTH_BRANCH_ELEMENT: Record<string, WuXingType> = {
  "寅": "木", "卯": "木",
  "巳": "火", "午": "火",
  "辰": "土", "未": "土", "戌": "土", "丑": "土",
  "申": "金", "酉": "金",
  "亥": "水", "子": "水",
};
