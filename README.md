# My Notes Blog

一个基于 **Vue 3 + TypeScript + Vite** 的个人笔记博客，用于记录前端学习中的知识点、踩坑记录与开发规范。

---

## 技术栈

- **Vue 3** —— 使用 `<script setup>` SFC 写法
- **TypeScript** —— 类型保障
- **Vite** —— 开发服务器与打包工具
- **Markdown** —— 笔记以 `.md` 文件形式存放在 `src/posts/` 下

更多 Vue 3 `<script setup>` 用法见 [script setup 官方文档](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)，项目配置与 IDE 支持见 [Vue TypeScript 指南](https://vuejs.org/guide/typescript/overview.html#project-setup)。

---

## 项目结构

```
my-notes-blog/
├── public/                # 静态资源
├── src/
│   ├── posts/              # 笔记目录（按 category 分子目录）
│   │   ├── vue/
│   │   ├── react/
│   │   ├── node/
│   │   └── perf/
│   ├── components/        # 公共组件
│   ├── views/             # 页面
│   ├── router.ts          # 路由
│   └── main.ts            # 启动入口
├── index.html
├── vite.config.ts
└── package.json
```

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview

# 类型检查
npm run type-check
```

---

## Git 提交规范

本项目同时推送到 **GitHub** 和 **Gitee**，使用如下约定：

### 1. 远程仓库命名建议

为方便区分多源仓库，建议把 GitHub 命名为 `github`，Gitee 命名为 `gitee`：

```bash
git remote add github <你的 GitHub 仓库地址>
git remote add gitee  <你的 Gitee 仓库地址>
git remote -v        # 查看已配置的远程仓库
```

### 2. 标准提交流程

进入项目根目录后依次执行：

```bash
cd c:/Users/xh_bu/Desktop/javascript/my-notes-blog/my-notes-blog

git add .

git commit -m "描述你这次改的内容，比如 fix: 首页图片加载"

git push github main

git push gitee  main
```

### 3. Commit 信息建议格式

推荐使用 [Conventional Commits](https://www.conventionalcommits.org/) 前缀：

| 前缀 | 用途 | 示例 |
| --- | --- | --- |
| `feat` | 新增笔记或新功能 | `feat(react): 新增 Fiber 架构笔记` |
| `fix` | 修复内容或样式问题 | `fix: 首页图片加载失败` |
| `docs` | 仅修改文档/注释 | `docs: 更新 README 笔记规范` |
| `style` | 仅调整格式（不影响功能） | `style: 统一代码缩进` |
| `refactor` | 重构（既非新功能也非修复） | `refactor: 重写路由懒加载逻辑` |
| `chore` | 构建/工具链/依赖变更 | `chore: 升级 vite 到 5.x` |

### 4. 首次推送分支

如果是新建仓库，第一次推送需要加 `-u` 建立上游关联：

```bash
git push -u github main
git push -u gitee  main
```

之后再推送就可以直接 `git push github main` / `git push gitee main`。

---

## 笔记编写规范

所有笔记统一使用 Markdown，文件存放在 `src/posts/<category>/` 下。**文件开头必须包含 YAML frontmatter**，字段如下：

```markdown
---
title: Node.js 事件循环机制        # 笔记标题
date: 2026-09-28                   # 创建日期，格式 YYYY-MM-DD
tag: Node.js                       # 标签，用于关键字检索
category: Node.js                  # 分类，决定侧边栏分组与目录
desc: 宏任务、微任务与事件循环六个阶段的执行顺序，以及和浏览器的差异。  # 简介，列表/卡片展示用
---
```

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 笔记标题，建议 30 字以内 |
| `date` | ✅ | 发布日期，`YYYY-MM-DD` 格式 |
| `tag` | ✅ | 主标签（如 `Vue`、`性能优化`），单数即可 |
| `category` | ✅ | 大分类，必须与 `src/posts/` 下的子目录名一致 |
| `desc` | ✅ | 一句话简介，建议 80 字以内 |

### 命名与目录规范

- **文件名**：`kebab-case`，例如 `vue-router.md`、`browser-render.md`
- **目录**：单层分类放在 `src/posts/<category>/` 下，不要嵌套过深
- **新增分类时**：在 `src/posts/` 下新建同名的子目录，并在路由/列表配置里注册

### 标题层级建议

- 一篇笔记只用一个 `#` 一级标题（与 `title` 保持一致或更凝练）
- 二级 `##` 划分主要小节
- 三级 `###` 划分子小节或具体概念
- 避免跳级使用（不要从 `#` 直接到 `###`）

### 代码块

- 涉及代码示例时必须标明语言：` ```ts `、` ```bash `、` ```js `
- 长代码尽量拆分成多段并加注释，而不是堆在一块

---

## 新增一篇笔记的步骤

1. 在 `src/posts/<category>/` 下新建 `xxx.md`
2. 按上面的 frontmatter 规范填写元信息
3. 撰写正文，遵循标题层级与代码块规范
4. 本地 `npm run dev` 预览效果，确认侧边栏 / 路由能正确加载
5. 按 [Git 提交规范](#git-提交规范) 提交并推送到 GitHub 与 Gitee

---

## License

MIT