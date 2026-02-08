/**
 * @toon-render/react
 * 
 * 将 TOON 格式渲染成 React 组件
 * 
 * 核心功能:
 * - ToonRenderer: 主渲染组件
 * - 事件处理: 支持点击、输入等事件
 * - 类型安全: 支持 TypeScript 类型定义
 * 
 * 工作流程:
 * 1. 用户输入提示词
 * 2. AI 生成 TOON 格式数据
 * 3. parseToon() 解析和验证
 * 4. ToonRenderer 渲染成 React 组件
 * 
 */

export { ToonRenderer } from "./renderer";
export type { ToonRendererProps } from "./renderer";

export type { ToonUI, Component } from "@toon-render/core";
