/**
 * 核心排盘测试
 */

import { getBaZi, getBaZiBySiZhu, getFullBaZi } from "../src/index";

describe("八字排盘", () => {
  test("基础排盘 - 1990年5月15日10点30分", () => {
    const result = getBaZi(new Date("1990-05-15 10:30"), "男");

    // 验证基本信息
    expect(result.gender).toBe("男");
    expect(result.baziString).toBeDefined();

    // 验证四柱结构
    expect(result.pillars.year).toBeDefined();
    expect(result.pillars.month).toBeDefined();
    expect(result.pillars.day).toBeDefined();
    expect(result.pillars.hour).toBeDefined();

    // 验证年柱
    expect(result.pillars.year.sixtyCycle).toBe("庚午");
    expect(result.pillars.year.sound).toBe("路旁土");

    // 验证特殊宫位
    expect(result.specialSigns.kongWang).toHaveLength(2);
    expect(result.specialSigns.xun).toBeDefined();
  });

  test("四柱反推", () => {
    const result = getBaZiBySiZhu("庚午", "辛巳", "戊午", "丁巳", "男");

    expect(result.baziString).toBe("庚午 辛巳 戊午 丁巳");
    expect(result.pillars.year.sixtyCycle).toBe("庚午");
    expect(result.pillars.month.sixtyCycle).toBe("辛巳");
    expect(result.pillars.day.sixtyCycle).toBe("戊午");
    expect(result.pillars.hour.sixtyCycle).toBe("丁巳");
  });

  test("早晚子时切换", () => {
    // 23:30 属于子时
    const earlyResult = getBaZi(new Date("1990-01-15 23:30"), "男", {
      zishiMode: "early",
    });

    const lateResult = getBaZi(new Date("1990-01-15 23:30"), "男", {
      zishiMode: "late",
    });

    // 早晚子时的日柱应该不同
    // 早子时：23:00-00:00 算次日
    // 晚子时：23:00-00:00 算当日
    expect(earlyResult.pillars.day.sixtyCycle).not.toBe(
      lateResult.pillars.day.sixtyCycle
    );
  });

  test("十神计算", () => {
    const result = getBaZi(new Date("1990-05-15 10:30"), "男");

    // 日柱十神为 null
    expect(result.pillars.day.tenStar).toBeNull();

    // 其他柱应该有十神
    expect(result.pillars.year.tenStar).toBeDefined();
    expect(result.pillars.month.tenStar).toBeDefined();
    expect(result.pillars.hour.tenStar).toBeDefined();
  });

  test("藏干信息", () => {
    const result = getBaZi(new Date("1990-05-15 10:30"), "男");

    // 每个地支都应该有藏干
    expect(result.pillars.year.earthBranch.hideHeavenStems.length).toBeGreaterThan(0);
    expect(result.pillars.month.earthBranch.hideHeavenStems.length).toBeGreaterThan(0);
    expect(result.pillars.day.earthBranch.hideHeavenStems.length).toBeGreaterThan(0);
    expect(result.pillars.hour.earthBranch.hideHeavenStems.length).toBeGreaterThan(0);
  });

  test("一键全量分析", () => {
    const result = getFullBaZi(new Date("1990-05-15 10:30"), "男");

    expect(result.bazi).toBeDefined();
    expect(result.fortune).toBeDefined();
    expect(result.shenSha).toBeDefined();
    expect(result.pattern).toBeDefined();
    expect(result.yongShen).toBeDefined();
  });
});
