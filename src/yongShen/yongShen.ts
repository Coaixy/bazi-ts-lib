/**
 * 用神判定模块 - 扶抑法
 */

import { YongShenResult } from "./type";
import { BaZiResult, WuXingType } from "../core/type";
import { analyzeWuXingStrength } from "./wuXingStrength";
import { WU_XING_SHENG, WU_XING_KE, WU_XING_SHENG_WO, WU_XING_BEI_KE } from "../maps/wuXing";

/**
 * 获取用神分析结果
 *
 * @param baziResult - 八字排盘结果
 * @returns 用神分析结果
 *
 * @example
 * ```typescript
 * const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
 * const yongShen = getYongShen(bazi);
 * console.log(yongShen.yongShen);  // 用神五行
 * console.log(yongShen.jiShen);    // 忌神五行
 * console.log(yongShen.reason);    // 判断依据
 * ```
 */
export function getYongShen(baziResult: BaZiResult): YongShenResult {
  // 分析五行力量
  const analysis = analyzeWuXingStrength(baziResult);
  const { dayMasterElement, dayMasterStrength } = analysis;

  let yongShen: WuXingType;
  let jiShen: WuXingType;
  let xiShen: WuXingType;
  let chouShen: WuXingType;
  let xianShen: WuXingType;
  let reason: string;

  if (dayMasterStrength === "强") {
    // 日主强，需要克泄耗
    // 用神：克我（官杀）或我生（食伤）
    // 忌神：生我（印）或同我（比劫）

    yongShen = WU_XING_KE[dayMasterElement]; // 我克之物（食伤泄气）
    jiShen = WU_XING_SHENG_WO[dayMasterElement]; // 生我之物（印星）
    xiShen = WU_XING_BEI_KE[dayMasterElement]; // 克我之物（官杀）
    chouShen = dayMasterElement; // 同我之物（比劫）
    xianShen = WU_XING_SHENG[WU_XING_KE[dayMasterElement]]; // 财星

    reason = `日主${dayMasterElement}偏强，喜克泄耗。用神取${yongShen}（食伤泄气），喜神为${xiShen}（官杀克身），忌神为${jiShen}（印星生身）。`;

  } else if (dayMasterStrength === "弱") {
    // 日主弱，需要生扶
    // 用神：生我（印）或同我（比劫）
    // 忌神：克我（官杀）或我生（食伤）

    yongShen = WU_XING_SHENG_WO[dayMasterElement]; // 生我之物（印星）
    jiShen = WU_XING_BEI_KE[dayMasterElement]; // 克我之物（官杀）
    xiShen = dayMasterElement; // 同我之物（比劫）
    chouShen = WU_XING_KE[dayMasterElement]; // 我克之物（食伤）
    xianShen = WU_XING_SHENG[dayMasterElement]; // 财星（闲神）

    reason = `日主${dayMasterElement}偏弱，喜生扶。用神取${yongShen}（印星生身），喜神为${xiShen}（比劫帮身），忌神为${jiShen}（官杀克身）。`;

  } else {
    // 日主中和，取调候或通关
    // 简化处理：以月令五行为参考

    const monthElement = analysis.scores.find(s => s.wangXiang === "旺")?.element || dayMasterElement;

    // 中和之命，用神取财官（较为通用的判断）
    yongShen = WU_XING_KE[dayMasterElement]; // 财星
    jiShen = WU_XING_SHENG_WO[dayMasterElement]; // 印星（过旺则忌）
    xiShen = WU_XING_BEI_KE[dayMasterElement]; // 官杀
    chouShen = WU_XING_SHENG[dayMasterElement]; // 食伤
    xianShen = dayMasterElement; // 比劫

    reason = `日主${dayMasterElement}中和，命局平衡。用神参考取${yongShen}（财星），喜神为${xiShen}（官星），具体需结合格局调候判断。`;
  }

  return {
    yongShen,
    jiShen,
    xiShen,
    chouShen,
    xianShen,
    analysis,
    reason,
  };
}

/**
 * 获取五行喜忌简表
 */
export function getWuXingFavorability(yongShenResult: YongShenResult): Record<WuXingType, "喜" | "忌" | "闲"> {
  const { yongShen, jiShen, xiShen, chouShen, xianShen } = yongShenResult;

  return {
    [yongShen]: "喜",
    [xiShen]: "喜",
    [jiShen]: "忌",
    [chouShen]: "忌",
    [xianShen]: "闲",
  } as Record<WuXingType, "喜" | "忌" | "闲">;
}
