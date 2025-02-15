# AI 文章生成器

一个基于 React + TypeScript 的专业文章生成工具，支持自定义 AI 接口，可以生成学术论文、博客文章等各类专业内容。

## 功能特点

### 核心功能
- 🤖 支持多种 AI 接口（OpenAI、自定义 API）
- 📝 专业文章大纲生成
- 📄 详细内容自动生成
- 👀 实时预览功能
- 🔄 分段生成与渐进式渲染
- 📊 生成进度实时显示

### 技术特点
- ⚛️ 基于 React 18 和 TypeScript
- 🎨 使用 Tailwind CSS 构建 UI
- 🔧 集成 shadcn/ui 组件库
- 📱 响应式设计

## 在线演示

[演示地址](#) (待添加)

## 安装与使用

### 环境要求
- Node.js 16.0 或更高版本
- npm 7.0 或更高版本

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/your-username/article-generator.git
cd article-generator
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

### 配置说明

1. API 设置
- OpenAI API
    - 需要提供有效的 API Key
    - 默认使用 gpt-3.5-turbo 模型
- 自定义 API
    - 支持自定义 API 地址
    - 可配置自定义认证方式
    - 支持自定义模型参数

2. 环境变量
   创建 `.env` 文件：
```env
VITE_DEFAULT_API_URL=your_default_api_url
VITE_DEFAULT_MODEL=your_default_model
```

## 使用指南

1. API 配置
    - 点击 "API 设置" 按钮
    - 选择 API 提供商（OpenAI 或自定义）
    - 输入必要的认证信息

2. 文章生成
    - 输入文章主题
    - 点击 "生成大纲" 按钮
    - 审查并编辑生成的大纲
    - 点击 "生成文章" 按钮
    - 等待内容分段生成完成

3. 内容编辑
    - 实时预览生成的内容
    - 可以随时编辑大纲和内容
    - 支持 Markdown 格式

## 项目结构

```
article-generator/
├── src/
│   ├── components/         # React 组件
│   │   ├── ArticleGenerator/
│   │   ├── Editor/
│   │   ├── Preview/
│   │   └── ui/            # UI 组件
│   ├── hooks/             # 自定义 Hooks
│   ├── utils/             # 工具函数
│   ├── types/             # TypeScript 类型定义
│   └── App.tsx            # 应用入口
├── public/                # 静态资源
└── package.json          # 项目配置
```

## 自定义开发

### 添加新的 API 提供商
1. 在 `src/types/index.ts` 中添加新的提供商类型
2. 在 `src/hooks/useArticleGenerator.ts` 中添加相应的处理逻辑
3. 更新 API 设置组件以支持新的提供商

### 自定义提示词
可以在 `src/constants/prompts.ts` 中修改生成提示词：
```typescript
export const PROMPTS = {
  OUTLINE: (topic: string) => `...`,
  CONTENT: (topic: string, outline: string) => `...`
};
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

此项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，欢迎提出 Issue 或通过以下方式联系：

- 邮件：[your-email@example.com](mailto:your-email@example.com)
- GitHub：[@your-username](https://github.com/your-username)

## 致谢

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
