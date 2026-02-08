import { defineCatalog, type Catalog } from "@toon-render/core";
import { buttonCatalog } from "./components/Button/catalog";
import { inputCatalog } from "./components/Input/catalog";

/**
 * 组件目录注册
 * 
 * 这里只负责注册各个组件的 catalog 定义
 * 每个组件的具体定义在对应的组件目录下的 catalog.ts 中
 * 
 * 新增组件时:
 * 1. 在组件目录下创建 catalog.ts 并导出 ComponentDefinition
 * 2. 在这里导入并注册
 */
export const catalog: Catalog = defineCatalog({
  button: buttonCatalog,
  input: inputCatalog,
});
