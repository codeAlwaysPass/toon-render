import { z } from "zod";

/**
 * 组件定义接口
 * 
 * 定义单个组件的结构和描述
 * Catalog 是所有可用组件的集合
 */
export interface ComponentDefinition {
  /** 
   * 组件契约
   * 用于验证 AI 生成的 props 是否合法
   * 
   * @example
   * ```typescript
   * z.object({
   *   label: z.string(),
   *   variant: z.enum(['primary', 'secondary'])
   * })
   * ```
   */
  props: z.ZodObject<any>;
  
  /** 
   * 组件的自然语言描述
   * 会被添加到 AI 的 system prompt 中
   * 帮助 AI 理解何时使用这个组件
   * 
   * @example "卡通风格按钮,用于用户交互"
   */
  description: string;
  
  /**
   * 组件示例 (可选)
   * 帮助 AI 理解如何使用这个组件
   */
  example?: string;
}

/**
 * 组件目录接口
 * 
 * Catalog 是 AI 和 UI 之间的 契约:
 * AI 只生成 catalog 中定义的组件
 * UI 只渲染 catalog 中注册的组件
 */
export interface Catalog {
  /** 所有可用组件 */
  components: Record<string, ComponentDefinition>;
  
  /** 
   * 生成 AI 的 system prompt
   * 告诉 AI 有哪些组件可用,每个组件的 props 是什么
   */
  prompt: () => string;
}

/**
 * 定义组件目录
 * 
 * @param components - 组件定义字典
 * @returns Catalog 对象,包含 prompt 生成函数
 * 
 * @example
 * ```typescript
 * const catalog = defineCatalog({
 *   button: {
 *     props: z.object({ 
 *       label: z.string(),
 *       variant: z.enum(["primary", "secondary"]).optional()
 *     }),
 *     description: "风格按钮",
 *     example: 'button,{label:"点击我",variant:"primary"}'
 *   },
 *   input: {
 *     props: z.object({ 
 *       placeholder: z.string().optional(),
 *       type: z.enum(["text", "password"]).optional()
 *     }),
 *     description: "输入框",
 *     example: 'input,{placeholder:"输入文字",type:"text"}'
 *   }
 * })
 * 
 * // 生成给 AI 的提示词
 * const systemPrompt = catalog.prompt()
 * ```
 * 
 * 为什么需要这个函数:
 * 1. **约束 AI 输出** - AI 只能使用定义的组件,不会生成未知组件
 * 2. **类型安全** - 通过 Zod 验证 props,防止运行时错误
 * 3. **自动生成文档** - prompt() 自动生成给 AI 的说明文档
 */
export function defineCatalog(components: Record<string, ComponentDefinition>): Catalog {
  return {
    components,
    
    /**
     * 生成 system prompt
     * 
     * 这个函数会被调用来生成发送给 大模型 的 system 消息
     * 
     * 工作流程:
     * 1. 遍历所有组件
     * 2. 提取每个组件的名称、描述、props schema
     * 3. 格式化成 AI 可理解的 TOON 格式
     * 4. 添加输出格式规范和示例
     * 
     * @returns 完整的 system prompt 字符串
     * 
     */
    prompt() {
      // 生成组件列表文档
      const componentList = Object.entries(components)
        .map(([name, def]) => {
          // 提取 props 的结构
          const propsFields = Object.entries(def.props.shape).map(([key, field]: [string, any]) => {
            let type = 'any';
            const typeName = field._def?.typeName;
            
            if (typeName === 'ZodString') type = 'string';
            else if (typeName === 'ZodNumber') type = 'number';
            else if (typeName === 'ZodBoolean') type = 'boolean';
            else if (typeName === 'ZodEnum') type = field._def.values.join(' | ');
            
            const optional = field.isOptional() ? '?' : '';
            return `    ${key}${optional}: ${type}`;
          }).join('\n');
          
          return `### ${name}
${def.description}

Props:
${propsFields}

${def.example ? `示例:\n  ${def.example}` : ''}`;
        })
        .join("\n\n");

      return `你是一个 UI 生成助手。

你的任务是根据用户的描述,生成符合 **TOON 格式** 的 UI 组件列表。

## 什么是 TOON 格式?

TOON (Token-Oriented Object Notation) 是一种为 LLM 优化的数据格式,比 JSON 更紧凑。

**JSON 格式** (不要使用):
\`\`\`json
{
  "components": [
    {"type": "button", "props": {"label": "点击我"}},
    {"type": "input", "props": {"placeholder": "输入"}}
  ]
}
\`\`\`

## TOON 格式规范

### 表格数组 vs 非均匀数组

**表格数组格式**（\`arrayName[N]{field1,field2}:\`）**只能用于基本类型**（字符串、数字、布尔值）。
**不能用于包含对象的列值**，否则会导致解析错误！

由于组件的 \`props\` 是对象，**必须使用非均匀数组格式**：

** 正确的 TOON 格式** (请使用):
\`\`\`toon
components[2]:
  - type: button
    props:
      label: "点击我"
      variant: "primary"
  - type: input
    props:
      placeholder: "输入"
      type: "text"
\`\`\`

** 错误的格式** (会导致解析错误):
\`\`\`toon
components[2]{type,props}:
  button,{label:"点击我"}
  input,{placeholder:"输入"}
\`\`\`

## 可用组件

${componentList}

## 输出格式规范

你**必须**严格按照以下 TOON 格式输出（使用非均匀数组）:

\`\`\`toon
components[N]:
  - type: <组件类型>
    props:
      <prop1>: <value1>
      <prop2>: <value2>
  - type: <组件类型>
    props:
      <prop1>: <value1>
      <prop2>: <value2>
  ...
\`\`\`

**格式说明:**
- \`components[N]\` - N 是组件数量
- 使用 \`-\` 前缀表示数组项
- 使用缩进表示嵌套结构
- \`props\` 是一个对象，使用缩进表示其属性
- 字符串值可以用引号包裹，也可以不用（如果值包含空格或特殊字符，必须用引号）

## 完整示例

**用户**: "创建一个登录表单"

**你的输出**:
\`\`\`toon
components[3]:
  - type: input
    props:
      placeholder: "用户名"
      type: "text"
      styleClass: "login-input"
  - type: input
    props:
      placeholder: "密码"
      type: "password"
      styleClass: "login-input"
  - type: button
    props:
      label: "登录"
      variant: "primary"
      styleClass: "login-button"
\`\`\`

**用户**: "创建一个搜索栏"

**你的输出**:
\`\`\`toon
components[2]:
  - type: input
    props:
      placeholder: "搜索..."
      type: "text"
  - type: button
    props:
      label: "搜索"
      variant: "primary"
\`\`\`

## 重要规则

1. **只使用上述定义的组件类型**
2. **严格遵循 TOON 格式**,不要输出 JSON
3. **必须使用非均匀数组格式**（因为 props 是对象），不要使用表格数组格式
4. **props 必须符合组件定义的 schema**
5. **输出必须包裹在 \`\`\`toon 代码块中**
6. **不要添加额外的解释文字**,只输出 TOON 数据

现在,请根据用户的描述生成 TOON 格式的组件列表`;
    },
  };
}
