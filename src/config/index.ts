/**
 * 配置系统 - 管理早晚子时、起运算法等全局配置
 */

import {
  LunarHour,
  ChildLimit,
  DefaultEightCharProvider,
  LunarSect2EightCharProvider,
  DefaultChildLimitProvider,
  China95ChildLimitProvider,
  LunarSect1ChildLimitProvider,
  LunarSect2ChildLimitProvider,
} from "tyme4ts";
import { BaZiConfig, DEFAULT_CONFIG } from "../core/type";

/**
 * 合并用户配置与默认配置
 */
export function mergeConfig(partial?: Partial<BaZiConfig>): BaZiConfig {
  return { ...DEFAULT_CONFIG, ...partial };
}

/**
 * 根据配置应用 tyme4ts 的 provider
 * 注意：tyme4ts 使用静态 provider，需要在计算前设置，计算后恢复
 */
export function applyConfig(config: BaZiConfig): void {
  // 设置早晚子时 provider
  LunarHour.provider = config.zishiMode === "late"
    ? new LunarSect2EightCharProvider()
    : new DefaultEightCharProvider();

  // 设置起运算法 provider
  const childLimitProviderMap = {
    "default": new DefaultChildLimitProvider(),
    "china95": new China95ChildLimitProvider(),
    "lunar_sect1": new LunarSect1ChildLimitProvider(),
    "lunar_sect2": new LunarSect2ChildLimitProvider(),
  };
  ChildLimit.provider = childLimitProviderMap[config.childLimitMode];
}

/**
 * 保存当前 provider 状态
 */
export function saveProviderState() {
  return {
    lunarHourProvider: LunarHour.provider,
    childLimitProvider: ChildLimit.provider,
  };
}

/**
 * 恢复 provider 状态
 */
export function restoreProviderState(state: ReturnType<typeof saveProviderState>) {
  LunarHour.provider = state.lunarHourProvider;
  ChildLimit.provider = state.childLimitProvider;
}

/**
 * 在指定配置下执行函数，执行完毕后恢复原有配置
 */
export function withConfig<T>(config: BaZiConfig, fn: () => T): T {
  const prevState = saveProviderState();
  applyConfig(config);
  try {
    return fn();
  } finally {
    restoreProviderState(prevState);
  }
}
