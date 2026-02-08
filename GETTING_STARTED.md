# Toon Render 完整使用指南

## 🎯 你已经完成的工作

✅ 所有包的代码已创建完成!

## 📋 下一步操作清单

### 1. 安装所有依赖

在项目根目录执行:

\`\`\`bash
cd /Users/lawrenceli/Desktop/OpenSource/toon-render
pnpm install
\`\`\`

**这会做什么:**
- 安装所有 workspace 的依赖
- 建立包之间的软链接
- 生成 \`pnpm-lock.yaml\`

### 2. 构建所有包

\`\`\`bash
pnpm build
\`\`\`

**构建顺序 (Turbo 自动管理):**
1. \`@toon-render/core\` (核心包)
2. \`@toon-render/ui\` (UI组件包)
3. \`@toon-render/react\` (React渲染器)
4. \`web\` (Next.js应用)

### 3. 配置 DeepSeek API Key

在 \`apps/web\` 目录创建 \`.env.local\`:

\`\`\`bash
cd apps/web
echo "DEEPSEEK_API_KEY=your_actual_api_key_here" > .env.local
\`\`\`

**获取API Key:**
1. 访问 https://platform.deepseek.com
2. 注册/登录账号
3. 在控制台创建 API Key
4. 复制并替换上面的 \`your_actual_api_key_here\`

### 4. 启动开发服务器

\`\`\`bash
cd ../..  # 回到根目录
pnpm dev
\`\`\`

**访问:**
- 打开浏览器访问 http://localhost:3000

---

## 🎨 使用示例

### 示例 1: 科技感登录表单

**输入提示词:**
\`\`\`
创建一个科技感的登录表单
\`\`\`

**AI 会生成:**
\`\`\`toon
components[3]{type,props}:
  input,{label:"用户名",placeholder:"请输入用户名",type:"text"}
  input,{label:"密码",placeholder:"请输入密码",type:"password"}
  button,{label:"登录",variant:"primary"}
\`\`\`

### 示例 2: 可爱风格搜索框

**输入提示词:**
\`\`\`
创建一个可爱风格的搜索框,包含搜索按钮
\`\`\`

**AI 会生成:**
\`\`\`toon
components[2]{type,props}:
  input,{placeholder:"🔍 搜索...",type:"text"}
  button,{label:"搜索",variant:"primary"}
\`\`\`

---

## 🔧 开发命令

| 命令 | 作用 | 说明 |
|------|------|------|
| \`pnpm install\` | 安装依赖 | 只需在根目录执行一次 |
| \`pnpm build\` | 构建所有包 | 首次运行或修改代码后执行 |
| \`pnpm dev\` | 启动开发服务器 | 自动重新构建和热更新 |
| \`pnpm type-check\` | 类型检查 | 检查 TypeScript 错误 |
| \`pnpm --filter core build\` | 只构建 core 包 | 单独构建某个包 |

---

## 🐛 常见问题

### Q1: \`pnpm install\` 报错

**问题:** \`Cannot find module '@toon-format/toon'\`

**解决:**
\`\`\`bash
# 清理并重新安装
rm -rf node_modules packages/*/node_modules apps/*/node_modules pnpm-lock.yaml
pnpm install
\`\`\`

### Q2: 构建报错

**问题:** TypeScript 类型错误

**解决:**
\`\`\`bash
# 按顺序手动构建
pnpm --filter @toon-render/core build
pnpm --filter @toon-render/ui build
pnpm --filter @toon-render/react build
pnpm --filter web build
\`\`\`

### Q3: DeepSeek API 调用失败

**问题:** \`DEEPSEEK_API_KEY not configured\`

**解决:**
1. 确认 \`.env.local\` 文件在 \`apps/web\` 目录
2. 确认 API Key 正确
3. 重启开发服务器

### Q4: 页面显示空白

**问题:** TOON 解析失败

**检查:**
1. 打开浏览器控制台查看错误
2. 检查 AI 返回的 TOON 格式是否正确
3. 确认所有包都已成功构建

---

## 📊 架构解释

### 为什么采用 Monorepo?

| 优势 | 说明 |
|------|------|
| **代码复用** | core 和 ui 可以在多个项目中使用 |
| **独立发布** | 可以将包发布到 npm |
| **类型安全** | 包之间的类型自动同步 |
| **统一构建** | Turbo 自动管理依赖和缓存 |

### 包的职责

\`\`\`
@toon-render/core      → TOON 解析、Schema 定义、Catalog
    ↓ 依赖
@toon-render/ui        → Button、Input 等 UI 组件
    ↓ 依赖
@toon-render/react     → ToonRenderer 渲染器
    ↓ 依赖
apps/web               → Next.js 应用、DeepSeek API 集成
\`\`\`

---

## 🎯 下一步扩展

### 添加新组件

**1. 创建 UI 组件** (\`packages/ui/src/card.tsx\`):
\`\`\`typescript
export const Card = ({ title, children }) => (
  <div className="rounded-lg border p-4">
    <h3 className="font-bold">{title}</h3>
    {children}
  </div>
)
\`\`\`

**2. 导出组件** (\`packages/ui/src/index.tsx\`):
\`\`\`typescript
export { Card } from "./card"
\`\`\`

**3. 注册到渲染器** (\`packages/react/src/renderer.tsx\`):
\`\`\`typescript
const COMPONENT_MAP = {
  button: Button,
  input: Input,
  card: Card,  // 新增
}
\`\`\`

**4. 添加到 catalog** (\`apps/web/app/page.tsx\`):
\`\`\`typescript
const catalog = defineCatalog({
  // ... 现有组件
  card: {
    props: z.object({
      title: z.string(),
    }),
    description: "卡片容器组件"
  }
})
\`\`\`

**5. 重新构建**:
\`\`\`bash
pnpm build
\`\`\`

---

## 📝 关键文件说明

| 文件 | 作用 | 何时修改 |
|------|------|---------|
| \`packages/core/src/schema.ts\` | TOON Schema 定义 | 修改数据结构时 |
| \`packages/core/src/catalog.ts\` | System Prompt 生成 | 调整 AI 行为时 |
| \`packages/ui/src/\` | UI 组件实现 | 添加/修改组件时 |
| \`packages/react/src/renderer.tsx\` | 组件映射表 | 添加新组件时 |
| \`apps/web/app/api/generate/route.ts\` | DeepSeek API 调用 | 修改 AI 配置时 |
| \`apps/web/app/page.tsx\` | 主页面和 catalog | 添加组件/修改UI时 |

---

## 🚀 现在开始!

执行以下命令启动项目:

\`\`\`bash
cd /Users/lawrenceli/Desktop/OpenSource/toon-render
pnpm install
pnpm build
cd apps/web
echo "DEEPSEEK_API_KEY=sk-your-key" > .env.local
cd ../..
pnpm dev
\`\`\`

然后访问 http://localhost:3000 开始体验! 🎉
