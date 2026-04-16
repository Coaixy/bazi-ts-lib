/**
 * 特殊宫位模块 - 胎元、胎息、命宫、身宫、空亡等
 */

import { EightChar, SixtyCycle } from "tyme4ts";
import { SpecialSigns } from "./type";

/**
 * 从 EightChar 构建特殊宫位信息
 */
export function buildSpecialSigns(eightChar: EightChar): SpecialSigns {
  // 胎元
  const fetalOrigin = eightChar.getFetalOrigin();

  // 胎息
  const fetalBreath = eightChar.getFetalBreath();

  // 命宫
  const ownSign = eightChar.getOwnSign();

  // 身宫
  const bodySign = eightChar.getBodySign();

  // 建除十二值
  const duty = eightChar.getDuty();

  // 空亡（从日柱干支获取）
  const daySixtyCycle = SixtyCycle.fromName(eightChar.getDay().getName());
  const kongWangBranches = daySixtyCycle.getExtraEarthBranches();

  // 旬首
  const xun = daySixtyCycle.getTen();

  return {
    fetalOrigin: fetalOrigin.getName(),
    fetalBreath: fetalBreath.getName(),
    ownSign: ownSign.getName(),
    bodySign: bodySign.getName(),
    duty: duty.getName(),
    kongWang: kongWangBranches.map((b) => b.getName()),
    xun: xun.getName(),
  };
}
