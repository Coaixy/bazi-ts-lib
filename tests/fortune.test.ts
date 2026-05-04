/**
 * 大运流年测试
 */

import {
  getBaZi,
  getFortune,
  getAnnualFortuneByYear,
  getAnnualFortuneRange,
} from "../src/index";

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

  test("流年干支应与真实公历年份一致", () => {
    const annual2024 = getAnnualFortuneByYear(bazi, birthDate, 2024);
    const annual2025 = getAnnualFortuneByYear(bazi, birthDate, 2025);
    const annual2026 = getAnnualFortuneByYear(bazi, birthDate, 2026);
    const annual2027 = getAnnualFortuneByYear(bazi, birthDate, 2027);
    const annual2028 = getAnnualFortuneByYear(bazi, birthDate, 2028);

    expect(annual2024?.sixtyCycle).toBe("甲辰");
    expect(annual2025?.sixtyCycle).toBe("乙巳");
    expect(annual2026?.sixtyCycle).toBe("丙午");
    expect(annual2027?.sixtyCycle).toBe("丁未");
    expect(annual2028?.sixtyCycle).toBe("戊申");
  });

  test("流年区间应返回真实公历年份序列", () => {
    const annuals = getAnnualFortuneRange(bazi, birthDate, 2024, 2028);

    expect(annuals.map((item) => [item.year, item.sixtyCycle])).toEqual([
      [2024, "甲辰"],
      [2025, "乙巳"],
      [2026, "丙午"],
      [2027, "丁未"],
      [2028, "戊申"],
    ]);
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
