# bazi-ts-lib

八字排盘 TypeScript 库，基于 [tyme4ts](https://github.com/6tail/tyme4ts) 构建。

## 功能特性

- **基础排盘**：四柱、纳音、藏干、十神、十二长生
- **早晚子时**：支持两种流派切换
- **大运流年**：支持 4 种起运算法
- **神煞系统**：151 个神煞（基于 tyme4ts）+ 年柱神煞
- **格局分析**：月令取格法判定八正格
- **用神分析**：五行力量评分 + 扶抑法判定

## 安装

```bash
npm install bazi-ts-lib
# 或
pnpm add bazi-ts-lib
```

## 快速开始

```typescript
import { getBaZi, getFortune, getShenSha, getPattern, getYongShen, getFullBaZi } from "bazi-ts-lib";

// 基础排盘
const bazi = getBaZi(new Date("1990-05-15 10:30"), "男");
console.log(bazi.baziString);                  // "庚午 辛巳 庚辰 辛巳"
console.log(bazi.pillars.day.sixtyCycle);      // "庚辰"
console.log(bazi.pillars.day.sound);           // "白蜡金"
console.log(bazi.specialSigns.ownSign);        // 命宫
console.log(bazi.specialSigns.kongWang);       // ["申", "酉"]

// 大运流年
const fortune = getFortune(bazi, new Date("1990-05-15 10:30"));
console.log(fortune.childLimit.startAge);      // 起运虚岁
console.log(fortune.decades[0].sixtyCycle);    // 第一步大运

// 神煞
const shensha = getShenSha(bazi);
console.log(shensha.yearShenSha);              // 年柱神煞
console.log(shensha.dayShenSha);               // 日柱神煞

// 格局
const pattern = getPattern(bazi);
console.log(pattern.name);                     // "七杀格"

// 用神
const yongShen = getYongShen(bazi);
console.log(yongShen.yongShen);                // 用神五行
console.log(yongShen.jiShen);                  // 忌神五行

// 一键全量分析
const result = getFullBaZi(new Date("1990-05-15 10:30"), "男");
```

## 配置选项

```typescript
interface BaZiConfig {
  // 子时切换："early" = 早子时（默认）| "late" = 晚子时
  zishiMode: "early" | "late";

  // 起运算法
  childLimitMode: "default" | "china95" | "lunar_sect1" | "lunar_sect2";

  // 大运步数，默认 10
  decadeCount: number;
}

// 使用配置
const bazi = getBaZi(new Date("1990-01-15 23:30"), "男", {
  zishiMode: "late",           // 晚子时
  childLimitMode: "china95",   // China95 起运算法
  decadeCount: 8,              // 8 步大运
});
```

## API 文档

### 核心函数

| 函数 | 说明 |
|------|------|
| `getBaZi(date, gender, config?)` | 基础排盘 |
| `getBaZiBySiZhu(year, month, day, hour, gender, config?)` | 四柱反推 |
| `getFortune(bazi, date, config?)` | 大运流年 |
| `getAnnualFortuneByYear(bazi, date, year, config?)` | 指定年份流年 |
| `getShenSha(bazi)` | 神煞查询 |
| `getPattern(bazi)` | 格局分析 |
| `getYongShen(bazi)` | 用神分析 |
| `getFullBaZi(date, gender, config?)` | 一键全量 |

### 类型导出

```typescript
// 基础类型
export type { WuXingType, YinYangType, Gender, TenStarType, TerrainType };

// 结果类型
export type { BaZiResult, FortuneResult, ShenShaResult, PatternResult, YongShenResult };

// 配置
export type { BaZiConfig };
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发调试
pnpm ts

# 运行测试
pnpm test

# 构建
pnpm build
```

## 许可证

Apache-2.0
