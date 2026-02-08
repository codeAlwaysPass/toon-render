/**
 * @toon-render/core
 * 
 * Toon 渲染引擎的核心包
 * 
 * 这个包提供:
 * - TOON 格式解析和验证 (基于官方 @toon-format/toon)
 * - 组件目录系统 (Catalog, ComponentDefinition)
 * - TypeScript 类型定义
 * 
 * 这个包**不依赖任何 UI 框架**,可以用于:
 * - React (@toon-render/react)
 * - Vue (Future)
 * - Svelte (Future)
 * - React Native (Future)
 * 
 * 关于 TOON 格式:
 * TOON (Token-Oriented Object Notation) 是一种专门为 LLM 优化的数据结构,
 * 比 JSON 节省 约40-60% 的 token,同时保持可读性。
 * 
 * 官方文档: https://github.com/toon-format/toon
 */

// ============ Schema ============
// 用于定义和验证 TOON 格式数据

export { 
  ComponentSchema, 
  ToonUISchema,
  parseToon,
  encodeToon
} from "./schema";

export type { 
  Component, 
  ToonUI 
} from "./schema";


// ============ Catalog ============
// 用于定义可用组件和生成 AI prompt

export { 
  defineCatalog 
} from "./catalog";

export type { 
  ComponentDefinition, 
  Catalog 
} from "./catalog";


