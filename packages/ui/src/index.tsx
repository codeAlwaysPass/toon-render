/**
 * @toon-render/ui
 * 
 * UI 组件库
 * 
 * 设计理念:
 * - **风格中立**: 不预设任何特定风格 (卡通、扁平等)
 * - **用户驱动**: 风格由用户通过 AI 提示词控制
 * - **高度可定制**: 支持通过 props 和 className 自定义样式
 * 
 * 核心组件:
 * - Button: 按钮组件 (支持 primary/secondary 等语义化变体)
 * - Input: 输入框组件 (支持 label、error、placeholder)
 * 
 * @example 用户控制风格
 * 用户: "创建一个科技感的登录表单"
 * AI 会生成带有科技风格类名的组件
 * 
 * 用户: "创建一个可爱风格的搜索框"
 * AI 会生成带有可爱风格类名的组件
 */

export { Button, buttonVariants } from "./components/Button";
export type { ButtonProps } from "./components/Button";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { cn } from "./utils";

// 导出组件目录，供 AI 生成和验证使用
export { catalog } from "./catalog";
