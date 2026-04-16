/**
 * 年柱神煞模块 - 完整的神煞查询系统
 */

import { ShenShaItem, ShenShaList } from "./type";
import {
  TIAN_YI_GUI_REN,
  TAI_JI_GUI_REN,
  WEN_CHANG_GUI_REN,
  GUO_YIN_GUI_REN,
  FU_XING_GUI_REN,
  YANG_REN,
  XUE_TANG,
  CI_GUAN,
  TIAN_DE_GUI_REN,
  YUE_DE_GUI_REN,
  TIAN_DE_HE,
  YUE_DE_HE,
  YI_MA,
  JIANG_XING,
  HUA_GAI,
  JIE_SHA,
  ZAI_SHA,
  WANG_SHEN,
  TAO_HUA,
  GU_CHEN,
  GUA_SU,
  KUI_GANG_DAYS,
  YIN_CHA_YANG_CUO_DAYS,
  TIAN_SHE,
  TIAN_GOU,
  BAI_HU,
  SANG_MEN,
  DIAO_KE,
  XUE_REN,
  FEI_REN,
  JIN_YU,
  TIAN_YI_TABLE,
  LU_SHEN,
  SAN_QI,
} from "./shenshaRules";

/**
 * 四柱信息
 */
interface FourPillarsInfo {
  yearStem: string;      // 年干
  yearBranch: string;    // 年支
  monthStem: string;     // 月干
  monthBranch: string;   // 月支
  dayStem: string;       // 日干
  dayBranch: string;     // 日支
  hourStem: string;      // 时干
  hourBranch: string;    // 时支
  dayPillar: string;     // 日柱干支
  allStems: string[];    // 所有天干
  allBranches: string[]; // 所有地支
}

/**
 * 获取完整的神煞列表
 *
 * @param info - 四柱信息
 * @returns 神煞列表
 */
export function getCompleteShenSha(info: FourPillarsInfo): ShenShaList {
  const result: ShenShaList = [];

  // ========== 1. 以日干查地支的神煞 ==========

  // 天乙贵人
  const tianYiTargets = TIAN_YI_GUI_REN[info.dayStem] || [];
  for (const branch of info.allBranches) {
    if (tianYiTargets.includes(branch)) {
      result.push({
        name: "天乙贵人",
        value: branch,
        pillar: getBranchPillar(branch, info),
        isGood: true,
        description: "人缘极佳、贵人多、逢凶化吉、利事业考试",
      });
    }
  }

  // 太极贵人
  const taiJiTargets = TAI_JI_GUI_REN[info.dayStem] || [];
  for (const branch of info.allBranches) {
    if (taiJiTargets.includes(branch)) {
      result.push({
        name: "太极贵人",
        value: branch,
        pillar: getBranchPillar(branch, info),
        isGood: true,
        description: "聪明好学、好奇玄学、福寿双全、晚年安稳",
      });
    }
  }

  // 文昌贵人
  const wenChangTarget = WEN_CHANG_GUI_REN[info.dayStem];
  if (wenChangTarget && info.allBranches.includes(wenChangTarget)) {
    result.push({
      name: "文昌贵人",
      value: wenChangTarget,
      pillar: getBranchPillar(wenChangTarget, info),
      isGood: true,
      description: "聪明文雅、利考试科举、著书立说",
    });
  }

  // 国印贵人
  const guoYinTarget = GUO_YIN_GUI_REN[info.dayStem];
  if (guoYinTarget && info.allBranches.includes(guoYinTarget)) {
    result.push({
      name: "国印贵人",
      value: guoYinTarget,
      pillar: getBranchPillar(guoYinTarget, info),
      isGood: true,
      description: "正直忠信、掌印权、办事公道、利文职",
    });
  }

  // 福星贵人
  const fuXingTarget = FU_XING_GUI_REN[info.dayStem];
  if (fuXingTarget && info.allBranches.includes(fuXingTarget)) {
    result.push({
      name: "福星贵人",
      value: fuXingTarget,
      pillar: getBranchPillar(fuXingTarget, info),
      isGood: true,
      description: "福禄无缺、平安悠闲、口福社交佳",
    });
  }

  // 羊刃
  const yangRenTarget = YANG_REN[info.dayStem];
  if (yangRenTarget && info.allBranches.includes(yangRenTarget)) {
    result.push({
      name: "羊刃",
      value: yangRenTarget,
      pillar: getBranchPillar(yangRenTarget, info),
      isGood: false,
      description: "刚烈勇敢；吉则武职创业，凶则血光冲动",
    });
  }

  // 飞刃
  const feiRenTarget = FEI_REN[info.dayStem];
  if (feiRenTarget && info.allBranches.includes(feiRenTarget)) {
    result.push({
      name: "飞刃",
      value: feiRenTarget,
      pillar: getBranchPillar(feiRenTarget, info),
      isGood: false,
      description: "羊刃对冲，主意外、冲动",
    });
  }

  // 学堂
  const xueTangTarget = XUE_TANG[info.dayStem];
  if (xueTangTarget && info.allBranches.includes(xueTangTarget)) {
    result.push({
      name: "学堂",
      value: xueTangTarget,
      pillar: getBranchPillar(xueTangTarget, info),
      isGood: true,
      description: "聪明好学、文才出众、利科举文章",
    });
  }

  // 词馆
  const ciGuanTarget = CI_GUAN[info.dayStem];
  if (ciGuanTarget && info.allBranches.includes(ciGuanTarget)) {
    result.push({
      name: "词馆",
      value: ciGuanTarget,
      pillar: getBranchPillar(ciGuanTarget, info),
      isGood: true,
      description: "文章秀丽、利官场文职",
    });
  }

  // 血刃
  const xueRenTarget = XUE_REN[info.dayStem];
  if (xueRenTarget && info.allBranches.includes(xueRenTarget)) {
    result.push({
      name: "血刃",
      value: xueRenTarget,
      pillar: getBranchPillar(xueRenTarget, info),
      isGood: false,
      description: "主血光、手术、外伤",
    });
  }

  // 金舆
  const jinYuTarget = JIN_YU[info.dayStem];
  if (jinYuTarget && info.allBranches.includes(jinYuTarget)) {
    result.push({
      name: "金舆",
      value: jinYuTarget,
      pillar: getBranchPillar(jinYuTarget, info),
      isGood: true,
      description: "贵人相助、出行平安、有车马之喜",
    });
  }

  // 禄神
  const luShenTarget = LU_SHEN[info.dayStem];
  if (luShenTarget && info.allBranches.includes(luShenTarget)) {
    result.push({
      name: "禄神",
      value: luShenTarget,
      pillar: getBranchPillar(luShenTarget, info),
      isGood: true,
      description: "财禄丰盈、衣食无忧",
    });
  }

  // ========== 2. 以月支查的神煞 ==========

  // 天德贵人
  const tianDeTarget = TIAN_DE_GUI_REN[info.monthBranch];
  if (tianDeTarget) {
    // 天德可能是干也可能是支，需要在四柱中查找
    if (info.allStems.includes(tianDeTarget) || info.allBranches.includes(tianDeTarget)) {
      result.push({
        name: "天德贵人",
        value: tianDeTarget,
        pillar: "月",
        isGood: true,
        description: "仁厚慈祥、护身化解灾厄、不犯刑狱",
      });
    }
  }

  // 天德合
  const tianDeHeTarget = TIAN_DE_HE[info.monthBranch];
  if (tianDeHeTarget) {
    if (info.allStems.includes(tianDeHeTarget) || info.allBranches.includes(tianDeHeTarget)) {
      result.push({
        name: "天德合",
        value: tianDeHeTarget,
        pillar: "月",
        isGood: true,
        description: "天德之合，同天德贵人之力",
      });
    }
  }

  // 月德贵人
  const yueDeTarget = YUE_DE_GUI_REN[info.monthBranch];
  if (yueDeTarget && info.allStems.includes(yueDeTarget)) {
    result.push({
      name: "月德贵人",
      value: yueDeTarget,
      pillar: "月",
      isGood: true,
      description: "处世无忧、逢凶化吉、少病少灾",
    });
  }

  // 月德合
  const yueDeHeTarget = YUE_DE_HE[info.monthBranch];
  if (yueDeHeTarget && info.allStems.includes(yueDeHeTarget)) {
    result.push({
      name: "月德合",
      value: yueDeHeTarget,
      pillar: "月",
      isGood: true,
      description: "月德之合，同月德贵人之力",
    });
  }

  // 天医
  const tianYiTarget = TIAN_YI_TABLE[info.monthBranch];
  if (tianYiTarget && info.allBranches.includes(tianYiTarget)) {
    result.push({
      name: "天医",
      value: tianYiTarget,
      pillar: getBranchPillar(tianYiTarget, info),
      isGood: true,
      description: "利医药、治疗、养生",
    });
  }

  // ========== 3. 以年支或日支查的神煞 ==========

  // 以下神煞同时以年支和日支查询
  const baseRefs = [
    { branch: info.yearBranch, label: "年" as const },
    { branch: info.dayBranch, label: "日" as const },
  ];

  for (const ref of baseRefs) {
    // 驿马
    const yiMaTarget = YI_MA[ref.branch];
    if (yiMaTarget && info.allBranches.includes(yiMaTarget)) {
      // 避免重复添加
      if (!result.some(r => r.name === "驿马" && r.value === yiMaTarget)) {
        result.push({
          name: "驿马",
          value: yiMaTarget,
          pillar: getBranchPillar(yiMaTarget, info),
          isGood: true,
          description: "迁移奔波、外出调动；吉则升迁，凶则劳碌",
        });
      }
    }

    // 将星
    const jiangXingTarget = JIANG_XING[ref.branch];
    if (jiangXingTarget && info.allBranches.includes(jiangXingTarget)) {
      if (!result.some(r => r.name === "将星" && r.value === jiangXingTarget)) {
        result.push({
          name: "将星",
          value: jiangXingTarget,
          pillar: getBranchPillar(jiangXingTarget, info),
          isGood: true,
          description: "领导权威、能文能武、掌握权柄、利武职创业",
        });
      }
    }

    // 华盖
    const huaGaiTarget = HUA_GAI[ref.branch];
    if (huaGaiTarget && info.allBranches.includes(huaGaiTarget)) {
      if (!result.some(r => r.name === "华盖" && r.value === huaGaiTarget)) {
        result.push({
          name: "华盖",
          value: huaGaiTarget,
          pillar: getBranchPillar(huaGaiTarget, info),
          isGood: true,
          description: "艺术天赋、清高孤独、利玄学宗教",
        });
      }
    }

    // 劫煞
    const jieShaTarget = JIE_SHA[ref.branch];
    if (jieShaTarget && info.allBranches.includes(jieShaTarget)) {
      if (!result.some(r => r.name === "劫煞" && r.value === jieShaTarget)) {
        result.push({
          name: "劫煞",
          value: jieShaTarget,
          pillar: getBranchPillar(jieShaTarget, info),
          isGood: false,
          description: "是非破财、勇猛（可从武）",
        });
      }
    }

    // 灾煞
    const zaiShaTarget = ZAI_SHA[ref.branch];
    if (zaiShaTarget && info.allBranches.includes(zaiShaTarget)) {
      if (!result.some(r => r.name === "灾煞" && r.value === zaiShaTarget)) {
        result.push({
          name: "灾煞",
          value: zaiShaTarget,
          pillar: getBranchPillar(zaiShaTarget, info),
          isGood: false,
          description: "灾祸血光，需吉星化解",
        });
      }
    }

    // 亡神
    const wangShenTarget = WANG_SHEN[ref.branch];
    if (wangShenTarget && info.allBranches.includes(wangShenTarget)) {
      if (!result.some(r => r.name === "亡神" && r.value === wangShenTarget)) {
        result.push({
          name: "亡神",
          value: wangShenTarget,
          pillar: getBranchPillar(wangShenTarget, info),
          isGood: false,
          description: "虚耗、不实、暗损",
        });
      }
    }

    // 桃花（咸池）
    const taoHuaTarget = TAO_HUA[ref.branch];
    if (taoHuaTarget && info.allBranches.includes(taoHuaTarget)) {
      if (!result.some(r => r.name === "桃花" && r.value === taoHuaTarget)) {
        result.push({
          name: "桃花",
          value: taoHuaTarget,
          pillar: getBranchPillar(taoHuaTarget, info),
          isGood: true, // 可吉可凶，默认标记为吉
          description: "魅力异性缘强；吉则人缘好，凶则色祸",
        });
      }
    }
  }

  // 孤辰（以年支查）
  const guChenTarget = GU_CHEN[info.yearBranch];
  if (guChenTarget && info.allBranches.includes(guChenTarget)) {
    result.push({
      name: "孤辰",
      value: guChenTarget,
      pillar: getBranchPillar(guChenTarget, info),
      isGood: false,
      description: "男怕孤辰、孤独清高、婚姻不利",
    });
  }

  // 寡宿（以年支查）
  const guaSuTarget = GUA_SU[info.yearBranch];
  if (guaSuTarget && info.allBranches.includes(guaSuTarget)) {
    result.push({
      name: "寡宿",
      value: guaSuTarget,
      pillar: getBranchPillar(guaSuTarget, info),
      isGood: false,
      description: "女怕寡宿、孤独清高、婚姻不利",
    });
  }

  // ========== 4. 以年支查的神煞 ==========

  // 天狗
  const tianGouTarget = TIAN_GOU[info.yearBranch];
  if (tianGouTarget && info.allBranches.includes(tianGouTarget)) {
    result.push({
      name: "天狗",
      value: tianGouTarget,
      pillar: getBranchPillar(tianGouTarget, info),
      isGood: false,
      description: "主口舌是非、血光",
    });
  }

  // 白虎
  const baiHuTarget = BAI_HU[info.yearBranch];
  if (baiHuTarget && info.allBranches.includes(baiHuTarget)) {
    result.push({
      name: "白虎",
      value: baiHuTarget,
      pillar: getBranchPillar(baiHuTarget, info),
      isGood: false,
      description: "主血光、丧事、意外",
    });
  }

  // 丧门
  const sangMenTarget = SANG_MEN[info.yearBranch];
  if (sangMenTarget && info.allBranches.includes(sangMenTarget)) {
    result.push({
      name: "丧门",
      value: sangMenTarget,
      pillar: getBranchPillar(sangMenTarget, info),
      isGood: false,
      description: "主丧事、哭泣",
    });
  }

  // 吊客
  const diaoKeTarget = DIAO_KE[info.yearBranch];
  if (diaoKeTarget && info.allBranches.includes(diaoKeTarget)) {
    result.push({
      name: "吊客",
      value: diaoKeTarget,
      pillar: getBranchPillar(diaoKeTarget, info),
      isGood: false,
      description: "主丧事、吊唁",
    });
  }

  // ========== 5. 以日柱查的神煞 ==========

  // 魁罡
  if (KUI_GANG_DAYS.includes(info.dayPillar)) {
    result.push({
      name: "魁罡",
      value: info.dayPillar,
      pillar: "日",
      isGood: true, // 身旺吉，身弱凶
      description: "聪明刚强、掌大权；身旺吉，身弱凶",
    });
  }

  // 阴差阳错
  if (YIN_CHA_YANG_CUO_DAYS.includes(info.dayPillar)) {
    result.push({
      name: "阴差阳错",
      value: info.dayPillar,
      pillar: "日",
      isGood: false,
      description: "婚姻感情多阻、六亲缘薄、做事留滞",
    });
  }

  // 天赦贵人（特定月+日组合）
  const tianSheDay = TIAN_SHE[info.monthBranch];
  if (tianSheDay === info.dayPillar) {
    result.push({
      name: "天赦贵人",
      value: info.dayPillar,
      pillar: "日",
      isGood: true,
      description: "逢凶化吉、解灾宽恕、利牢狱化解",
    });
  }

  // ========== 6. 三奇贵人（特殊组合） ==========
  checkSanQi(info.allStems, result);

  return result;
}

/**
 * 检查三奇贵人
 */
function checkSanQi(allStems: string[], result: ShenShaList): void {
  // 天上三奇：甲戊庚（需顺排）
  if (checkSanQiSequence(allStems, SAN_QI.天上三奇)) {
    result.push({
      name: "三奇贵人（天上）",
      value: "甲戊庚",
      pillar: "年",
      isGood: true,
      description: "博学多才、机智灵巧、专业技能强",
    });
  }

  // 地下三奇：乙丙丁（需顺排）
  if (checkSanQiSequence(allStems, SAN_QI.地下三奇)) {
    result.push({
      name: "三奇贵人（地下）",
      value: "乙丙丁",
      pillar: "年",
      isGood: true,
      description: "博学多才、机智灵巧、专业技能强",
    });
  }

  // 人中三奇：辛壬癸（需顺排）
  if (checkSanQiSequence(allStems, SAN_QI.人中三奇)) {
    result.push({
      name: "三奇贵人（人中）",
      value: "辛壬癸",
      pillar: "年",
      isGood: true,
      description: "博学多才、机智灵巧、专业技能强",
    });
  }
}

/**
 * 检查三奇是否按顺序排列
 */
function checkSanQiSequence(allStems: string[], sanQi: string[]): boolean {
  // 检查三个天干是否都存在
  if (!sanQi.every(s => allStems.includes(s))) {
    return false;
  }

  // 获取各天干的位置
  const positions = sanQi.map(s => allStems.indexOf(s));

  // 检查是否顺排（位置递增）
  return positions[0] < positions[1] && positions[1] < positions[2];
}

/**
 * 获取地支所在的柱位
 */
function getBranchPillar(branch: string, info: FourPillarsInfo): "年" | "月" | "日" | "时" {
  if (info.yearBranch === branch) return "年";
  if (info.monthBranch === branch) return "月";
  if (info.dayBranch === branch) return "日";
  if (info.hourBranch === branch) return "时";
  return "年"; // 默认
}

// ========== 保留旧 API 兼容 ==========

/**
 * 获取年柱神煞（兼容旧 API）
 *
 * @param yearBranch - 年支
 * @param dayHeavenStem - 日干
 * @param allBranches - 四柱所有地支 [年支, 月支, 日支, 时支]
 * @returns 神煞列表
 * @deprecated 请使用 getCompleteShenSha
 */
export function getYearShenSha(
  yearBranch: string,
  dayHeavenStem: string,
  allBranches: string[]
): ShenShaList {
  // 简化实现，仅返回基础神煞
  const result: ShenShaList = [];

  // 天乙贵人
  const guiRenBranches = TIAN_YI_GUI_REN[dayHeavenStem] || [];
  for (const branch of allBranches) {
    if (guiRenBranches.includes(branch)) {
      result.push({
        name: "天乙贵人",
        value: branch,
        pillar: "年",
        isGood: true,
        description: "遇难呈祥，逢凶化吉",
      });
      break;
    }
  }

  // 驿马
  const yiMaBranch = YI_MA[yearBranch];
  if (yiMaBranch && allBranches.includes(yiMaBranch)) {
    result.push({
      name: "驿马",
      value: yiMaBranch,
      pillar: "年",
      isGood: true,
      description: "主奔波、迁动、出行",
    });
  }

  // 将星
  const jiangXingBranch = JIANG_XING[yearBranch];
  if (jiangXingBranch && allBranches.includes(jiangXingBranch)) {
    result.push({
      name: "将星",
      value: jiangXingBranch,
      pillar: "年",
      isGood: true,
      description: "主权贵、领导力",
    });
  }

  // 华盖
  const huaGaiBranch = HUA_GAI[yearBranch];
  if (huaGaiBranch && allBranches.includes(huaGaiBranch)) {
    result.push({
      name: "华盖",
      value: huaGaiBranch,
      pillar: "年",
      isGood: true,
      description: "主聪明、艺术、孤独",
    });
  }

  // 劫煞
  const jieShaBranch = JIE_SHA[yearBranch];
  if (jieShaBranch && allBranches.includes(jieShaBranch)) {
    result.push({
      name: "劫煞",
      value: jieShaBranch,
      pillar: "年",
      isGood: false,
      description: "主灾祸、损失",
    });
  }

  // 亡神
  const wangShenBranch = WANG_SHEN[yearBranch];
  if (wangShenBranch && allBranches.includes(wangShenBranch)) {
    result.push({
      name: "亡神",
      value: wangShenBranch,
      pillar: "年",
      isGood: false,
      description: "主虚耗、不实",
    });
  }

  // 桃花
  const taoHuaBranch = TAO_HUA[yearBranch];
  if (taoHuaBranch && allBranches.includes(taoHuaBranch)) {
    result.push({
      name: "桃花",
      value: taoHuaBranch,
      pillar: "年",
      isGood: true,
      description: "主人缘、异性缘、风流",
    });
  }

  return result;
}
