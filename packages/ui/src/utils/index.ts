import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 CSS 类名工具函数
 * 
 * 使用 clsx 处理条件类名,使用 tailwind-merge 解决冲突
 * 
 * @param inputs - 类名数组
 * @returns 合并后的类名字符串
 * 
 * @example
 * ```typescript
 * cn('px-2', 'px-4') // => 'px-4' (后者覆盖前者)
 * cn('text-red-500', isActive && 'text-blue-500') // 条件类名
 * ```
 * 
 * 为什么需要这个函数:
 * - **clsx**: 处理条件类名 (falsy 值会被过滤)
 * - **twMerge**: 解决 Tailwind 类名冲突 (如 px-2 vs px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
