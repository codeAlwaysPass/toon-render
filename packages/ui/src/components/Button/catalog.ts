import { type ComponentDefinition } from "@toon-render/core";
import { z } from "zod";

/**
 * Button 组件的 Catalog 定义
 * 
 * 定义按钮组件的 props schema、描述和示例
 * 与 Button.tsx 中的 ButtonProps 保持一致
 */
export const buttonCatalog: ComponentDefinition = {
  props: z.object({
    label: z.string(),
    variant: z.enum(["primary", "secondary", "outline", "ghost", "link"]).optional(),
    size: z.enum(["sm", "md", "lg"]).optional(),
    styleClass: z.string().optional(),
  }),
  description: "按钮组件 - 用于用户交互",
  example: 'button,{label:"点击我",variant:"primary"}',
};
