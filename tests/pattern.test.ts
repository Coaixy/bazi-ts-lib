/**
 * 格局分析测试
 */

import { getBaZi, getPattern } from "../src/index";

describe("格局分析", () => {
  test("正格判定", () => {
    const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
    const pattern = getPattern(bazi);

    expect(pattern.name).toBeDefined();
    expect(pattern.monthBranch).toBeDefined();
    expect(pattern.monthMainTenStar).toBeDefined();
    expect(pattern.monthElement).toBeDefined();
    expect(pattern.description).toBeDefined();
    expect(pattern.reliability).toMatch(/确定|参考/);
  });

  test("格局描述非空", () => {
    const bazi = getBaZi(new Date("1985-03-20 14:00"), "女");
    const pattern = getPattern(bazi);

    expect(pattern.description.length).toBeGreaterThan(0);
  });

  test("月令取格", () => {
    // 测试不同月份的格局
    const dates = [
      new Date("1990-01-15 10:00"), // 丑月
      new Date("1990-04-15 10:00"), // 辰月
      new Date("1990-07-15 10:00"), // 未月
      new Date("1990-10-15 10:00"), // 戌月
    ];

    for (const date of dates) {
      const bazi = getBaZi(date, "男");
      const pattern = getPattern(bazi);

      expect(pattern.monthBranch).toBeDefined();
      expect(pattern.name).toBeDefined();
    }
  });
});
