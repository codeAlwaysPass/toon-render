# Toon Render

AI驱动的UI生成平台 - 基于TOON格式,节省60% Token

## 项目特点

- UI组件不预设任何风格，完全由用户通过AI提示词控制
- 使用TOON格式，比JSON节省40-60% token
- 支持完整的TypeScript类型定义和Zod运行时校验

## 项目结构

```
toon-render/
├── packages/
│   ├── core/           # 核心逻辑(TOON解析、Schema定义)
│   ├── ui/             # UI组件库(Button、Input等)
│   └── react/          # React渲染器
├── apps/
│   └── web/            # Next.js应用(接入DeepSeek API)
├── pnpm-workspace.yaml
└── turbo.json
```

## 🚀 快速开始ƒ

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

在 `apps/web` 目录下创建 `.env.local`:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 3. 构建所有包

```bash
pnpm build
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 📖 TOON 格式示例

**用户输入**: "创建一个科技感的登录表单"

**AI输出 (TOON格式)**:
```toon
components[3]{type,props}:
  input,{label:"用户名",placeholder:"请输入用户名",type:"text"}
  input,{label:"密码",placeholder:"请输入密码",type:"password"}
  button,{label:"登录",variant:"primary"}
```

相比JSON格式:
- **JSON**: ~150 tokens
- **TOON**: ~60 tokens
- **节省**: 60%

## 架构设计

### 数据流

```
用户输入提示词
    ↓
DeepSeek API (使用 catalog.prompt())
    ↓
返回 TOON 格式数据
    ↓
parseToon() 解析和验证
    ↓
ToonRenderer 渲染成 React 组件
    ↓
浏览器显示
```


## 如何添加新组件

1. **在 `packages/ui` 中创建组件**:

```typescript
// packages/ui/src/card.tsx
export const Card = ({ title, children }) => (
  <div className="card">
    <h3>{title}</h3>
    {children}
  </div>
)
```

2. **在 `packages/react` 中注册**:

```typescript
// packages/react/src/renderer.tsx
const COMPONENT_MAP = {
  button: Button,
  input: Input,
  card: Card,  // 新增
}
```

3. **在 catalog 中定义**:

```typescript
const catalog = defineCatalog({
  card: {
    props: z.object({
      title: z.string(),
    }),
    description: "卡片容器组件"
  }
})
```

## License

MIT License

## 🙏 致谢
- [TOON Format](https://github.com/toon-format/toon) - Token优化的数据格式
- [DeepSeek](https://www.deepseek.com) - 强大的AI模型
- [json-render](https://github.com/vercel-labs/json-render) - 灵感来源
