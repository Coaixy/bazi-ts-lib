/**
 * 用神分析测试
 */

import { getBaZi, getYongShen, analyzeWuXingStrength, getWuXingFavorability } from "../src/index";

describe("用神分析", () => {
  test("五行力量分析", () => {
    const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
    const analysis = analyzeWuXingStrength(bazi);

    // 验证五行评分
    expect(analysis.scores).toHaveLength(5);

    // 每个五行都有评分
    for (const score of analysis.scores) {
      expect(score.element).toBeDefined();
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.wangXiang).toMatch(/旺|相|休|囚|死/);
      expect(score.count).toBeGreaterThanOrEqual(0);
    }

    // 日主信息
    expect(analysis.dayMasterElement).toBeDefined();
    expect(analysis.dayMasterStrength).toMatch(/强|弱|中和/);
    expect(analysis.dominantElement).toBeDefined();
    expect(analysis.weakestElement).toBeDefined();
  });

  test("用神判定", () => {
    const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
    const yongShen = getYongShen(bazi);

    // 验证用神结果
    expect(yongShen.yongShen).toMatch(/木|火|土|金|水/);
    expect(yongShen.jiShen).toMatch(/木|火|土|金|水/);
    expect(yongShen.xiShen).toMatch(/木|火|土|金|水/);
    expect(yongShen.chouShen).toMatch(/木|火|土|金|水/);
    expect(yongShen.xianShen).toMatch(/木|火|土|金|水/);

    // 验证分析数据
    expect(yongShen.analysis).toBeDefined();
    expect(yongShen.reason.length).toBeGreaterThan(0);
  });

  test("五行喜忌表", () => {
    const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
    const yongShen = getYongShen(bazi);
    const favorability = getWuXingFavorability(yongShen);

    // 验证喜忌表
    const values = Object.values(favorability);
    expect(values).toContain("喜");
    expect(values).toContain("忌");
  });

  test("不同命局的用神不同", () => {
    const bazi1 = getBaZi(new Date("1990-05-15 10:30"), "男");
    const bazi2 = getBaZi(new Date("1985-12-20 02:00"), "女");

    const yongShen1 = getYongShen(bazi1);
    const yongShen2 = getYongShen(bazi2);

    // 日主五行不同
    expect(yongShen1.analysis.dayMasterElement).not.toBe(
      yongShen2.analysis.dayMasterElement
    );
  });
});
