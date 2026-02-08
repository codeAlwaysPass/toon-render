import { type ComponentDefinition } from "@toon-render/core";
import { z } from "zod";

/**
 * Input 组件的 Catalog 定义
 * 
 * 定义输入框组件的 props schema、描述和示例
 * 与 Input.tsx 中的 InputProps 保持一致
 */
export const inputCatalog: ComponentDefinition = {
  props: z.object({
    label: z.string().optional(),
    placeholder: z.string().optional(),
    type: z.enum(["text", "password", "email", "number"]).optional(),
    error: z.string().optional(),
    styleClass: z.string().optional(),
  }),
  description: "输入框组件 - 用于文本输入",
  example: 'input,{label:"用户名",placeholder:"请输入用户名",type:"text"}',
};
