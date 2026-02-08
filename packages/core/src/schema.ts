import { z } from "zod";
import { decode } from "@toon-format/toon";

/**
 * 组件定义 Schema
 * 
 * TOON 格式下 单个组件的结构
 * 
 * @example TOON 格式输入（非均匀数组格式）:
 * ```toon
 * components[2]:
 *   - type: button
 *     props:
 *       label: "button"
 *       variant: "primary"
 *   - type: input
 *     props:
 *       placeholder: "请输入文字"
 *       type: "text"
 * ```
 */
export const ComponentSchema = z.object({
  /** 
   * 组件类型
   * button | input | card | ...
   */
  type: z.string(),
  
  /** 
   * 组件属性
   * 根据 type 不同, props 的结构也不同
   * 
   * 例如:
   * - Button: { label: string, variant?: "primary" | "secondary" }
   * - Input: { placeholder?: string, type?: "text" | "password" }
   */
  props: z.record(z.string(), z.any()).optional(),
});

/**
 * TOON 组件列表 Schema
 * 
 * 完整的 UI 规范, 包含所有组件定义
 * 
 * @example TOON 输入（非均匀数组格式）:
 * ```toon
 * components[3]:
 *   - type: button
 *     props:
 *       label: "登录"
 *       variant: "primary"
 *   - type: input
 *     props:
 *       placeholder: "用户名"
 *       type: "text"
 *   - type: input
 *     props:
 *       placeholder: "密码"
 *       type: "password"
 * ```
 * 
 * 这会被解析成:
 * ```typescript
 * {
 *   components: [
 *     { type: "button", props: { label: "登录", variant: "primary" } },
 *     { type: "input", props: { placeholder: "用户名", type: "text" } },
 *     { type: "input", props: { placeholder: "密码", type: "password" } }
 *   ]
 * }
 * ```
 */
export const ToonUISchema = z.object({
  /** 
   * 组件列表
   * 从上到下按顺序渲染
   */
  components: z.array(ComponentSchema),
});

/** TypeScript 类型推导 */
export type Component = z.infer<typeof ComponentSchema>;
export type ToonUI = z.infer<typeof ToonUISchema>;

/**
 * 解析 TOON 格式字符串
 * 
 * 使用官方 @toon-format/toon 包解析
 * 
 * @param toonString - TOON 格式的字符串
 * @returns 解析后的 JavaScript 对象
 * 
 * @example
 * ```typescript
 * const toon = `
 * components[2]:
 *   - type: button
 *     props:
 *       label: "点击我"
 *   - type: input
 *     props:
 *       placeholder: "输入"
 * `
 * 
 * const result = parseToon(toon)
 * // {
 * //   components: [
 * //     { type: "button", props: { label: "点击我" } },
 * //     { type: "input", props: { placeholder: "输入" } }
 * //   ]
 * // }
 * ```
 * 
 * Why Need:
 * 1. **统一入口**: 所有 TOON 解析都通过这里
 * 2. **类型验证**: 使用 Zod 确保数据格式正确
 * 3. **错误处理**: 捕获解析错误并提供友好提示
 */
export function parseToon(toonString: string): ToonUI {
  try {
    // 1. 使用官方库解析 TOON 格式
    const parsed = decode(toonString);
    
    // 2. 使用 Zod 验证数据结构
    const validated = ToonUISchema.parse(parsed);
    
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `TOON Data Format Error:\n${
          error.issues
            .map((e: any) => `  - ${e.path.join('.')}: ${e.message}`)
            .join('\n')
        }`
      );
    }
    throw new Error(`TOON Parse Failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 编码为 TOON 格式 (for debug)
 * 
 * @param data - JavaScript 对象
 * @returns TOON 格式字符串
 * 
 * @example
 * ```typescript
 * const data = {
 *   components: [
 *     { type: "button", props: { label: "提交" } }
 *   ]
 * }
 * 
 * console.log(encodeToon(data))
 * // components[1]:
 * //   - type: button
 * //     props:
 * //       label: "提交"
 * ```
 */
export function encodeToon(data: ToonUI): string {
  // 注意: @toon-format/toon 的 encode 需要单独导入
  // 这里先用简单实现,后续可以替换成官方 encode
  const { encode } = require("@toon-format/toon");
  return encode(data);
}