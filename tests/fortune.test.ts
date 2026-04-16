/**
 * 大运流年测试
 */

import { getBaZi, getFortune, getAnnualFortuneByYear } from "../src/index";

describe("大运流年", () => {
  const birthDate = new Date("1990-05-15 10:30");
  const bazi = getBaZi(birthDate, "男");

  test("童限计算", () => {
    const fortune = getFortune(bazi, birthDate);

    expect(fortune.childLimit).toBeDefined();
    expect(fortune.childLimit.startAge).toBeGreaterThan(0);
    expect(fortune.childLimit.yearCount).toBeGreaterThanOrEqual(0);
    expect(fortune.childLimit.monthCount).toBeGreaterThanOrEqual(0);
    expect(fortune.childLimit.isForward).toBeDefined();
  });

  test("大运列表", () => {
    const fortune = getFortune(bazi, birthDate, { decadeCount: 8 });

    expect(fortune.decades).toHaveLength(8);

    // 验证大运结构
    const firstDecade = fortune.decades[0];
    expect(firstDecade.index).toBe(0);
    expect(firstDecade.sixtyCycle).toBeDefined();
    expect(firstDecade.heavenStem).toBeDefined();
    expect(firstDecade.earthBranch).toBeDefined();
    expect(firstDecade.sound).toBeDefined();
    expect(firstDecade.startAge).toBeGreaterThan(0);
    expect(firstDecade.tenStar).toBeDefined();
    expect(firstDecade.terrain).toBeDefined();
  });

  test("大运岁数递增", () => {
    const fortune = getFortune(bazi, birthDate, { decadeCount: 5 });

    for (let i = 1; i < fortune.decades.length; i++) {
      const prev = fortune.decades[i - 1];
      const curr = fortune.decades[i];

      // 每步大运 10 年
      expect(curr.startAge).toBe(prev.startAge + 10);
    }
  });

  test("指定年份流年", () => {
    const annual = getAnnualFortuneByYear(bazi, birthDate, 2024);

    expect(annual).toBeDefined();
    expect(annual?.year).toBe(2024);
    expect(annual?.sixtyCycle).toBeDefined();
    expect(annual?.age).toBeGreaterThan(0);
  });

  test("起运算法切换", () => {
    const defaultFortune = getFortune(bazi, birthDate, {
      childLimitMode: "default",
    });

    const china95Fortune = getFortune(bazi, birthDate, {
      childLimitMode: "china95",
    });

    // 不同算法可能产生不同的起运时间
    expect(defaultFortune.childLimit.startTime).toBeDefined();
    expect(china95Fortune.childLimit.startTime).toBeDefined();
  });
});
