/**
 * 正格判定模块 - 月令取格法
 */

import { SixtyCycle, HeavenStem, EarthBranch } from "tyme4ts";
import { PatternResult, TEN_STAR_TO_PATTERN, ZhengGeName } from "./type";
import { BaZiResult, TenStarType, WuXingType } from "../core/type";

/**
 * 获取格局分析结果
 *
 * @param baziResult - 八字排盘结果
 * @returns 格局判断结果
 *
 * @example
 * ```typescript
 * const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
 * const pattern = getPattern(bazi);
 * console.log(pattern.name);        // "正官格"
 * console.log(pattern.description); // 格局描述
 * ```
 */
export function getPattern(baziResult: BaZiResult): PatternResult {
  const { pillars } = baziResult;

  // 获取日干和月支
  const dayPillar = pillars.day.sixtyCycle;
  const monthPillar = pillars.month.sixtyCycle;

  const daySC = SixtyCycle.fromName(dayPillar);
  const monthSC = SixtyCycle.fromName(monthPillar);

  const dayHeavenStem = daySC.getHeavenStem();
  const monthBranch = monthSC.getEarthBranch();

  // 获取月支藏干主气
  const hideStems = monthBranch.getHideHeavenStems();
  const mainHideStem = hideStems.find(hs => hs.getType() === 2); // MAIN = 2
  if (!mainHideStem) {
    return createDefaultPattern(monthBranch);
  }

  const mainStem = mainHideStem.getHeavenStem();

  // 计算月令主气对日主的十神关系
  const tenStar = dayHeavenStem.getTenStar(mainStem);
  const tenStarName = tenStar.getName() as TenStarType;

  // 获取月令五行
  const monthElement = monthBranch.getElement().getName() as WuXingType;

  // 判断格局
  const patternName = TEN_STAR_TO_PATTERN[tenStarName];

  if (patternName) {
    // 正格
    return {
      name: patternName,
      isSpecial: false,
      monthBranch: monthBranch.getName(),
      monthMainTenStar: tenStarName,
      monthElement,
      description: getPatternDescription(patternName),
      reliability: "确定",
    };
  }

  // 比肩或劫财 -> 建禄格或月刃格
  if (tenStarName === "比肩") {
    return {
      name: "建禄格",
      isSpecial: false,
      monthBranch: monthBranch.getName(),
      monthMainTenStar: tenStarName,
      monthElement,
      description: "月令为日主之禄，主自立、独立",
      reliability: "确定",
    };
  }

  if (tenStarName === "劫财") {
    return {
      name: "月刃格",
      isSpecial: false,
      monthBranch: monthBranch.getName(),
      monthMainTenStar: tenStarName,
      monthElement,
      description: "月令为日主之刃，主刚强、竞争",
      reliability: "确定",
    };
  }

  return createDefaultPattern(monthBranch);
}

/**
 * 创建默认格局结果
 */
function createDefaultPattern(monthBranch: EarthBranch): PatternResult {
  return {
    name: "杂格",
    isSpecial: true,
    monthBranch: monthBranch.getName(),
    monthMainTenStar: "比肩",
    monthElement: monthBranch.getElement().getName() as WuXingType,
    description: "格局不明显，需综合分析",
    reliability: "参考",
  };
}

/**
 * 获取格局描述
 */
function getPatternDescription(patternName: ZhengGeName): string {
  const descriptions: Record<ZhengGeName, string> = {
    "正官格": "月令透正官，主正直、守法、官运",
    "七杀格": "月令透七杀，主权威、魄力、压力",
    "正印格": "月令透正印，主学问、慈爱、贵人",
    "偏印格": "月令透偏印，主聪明、机警、孤独",
    "食神格": "月令透食神，主福禄、才华、享受",
    "伤官格": "月令透伤官，主才华、叛逆、口才",
    "正财格": "月令透正财，主勤劳、稳定、守财",
    "偏财格": "月令透偏财，主豪爽、投资、外财",
  };
  return descriptions[patternName] || "格局描述待补充";
}

/**
 * 判断是否为从格（日主极弱无根）
 * 这是一个简化的判断，完整判断需要更复杂的五行力量分析
 */
export function checkCongGe(baziResult: BaZiResult): boolean {
  // 简化判断：检查日干在四柱中是否有根
  const dayElement = baziResult.pillars.day.heavenStem.element;
  const { pillars } = baziResult;

  // 统计同五行的地支藏干数量
  let rootCount = 0;
  const branches = [
    pillars.year.earthBranch,
    pillars.month.earthBranch,
    pillars.day.earthBranch,
    pillars.hour.earthBranch,
  ];

  for (const branch of branches) {
    for (const hideStem of branch.hideHeavenStems) {
      if (hideStem.element === dayElement) {
        rootCount++;
      }
    }
  }

  // 如果日干无根或根很弱，可能是从格
  return rootCount === 0;
}
