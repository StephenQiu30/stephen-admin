# 仓库协作规范

适用于整个 `stephen-admin` 仓库。开始修改前先阅读 [PROJECT.md](PROJECT.md) 和 [README.md](README.md)。

## 工作边界

- 这是独立的管理端 Git 仓库；`stephen-cloud` 是相邻的后端仓库。先检查工作区状态，不覆盖并行进行的页面或视觉改动。
- 页面路由在 `config/routes.ts`；API 的运行时请求配置在 `src/requestConfig.ts` 和 `src/constants/index.ts`；OpenAPI schema 地址在 `config/config.ts`。
- `src/services/{user,post,notification,search,file,log,mail,ai}` 由 OpenAPI 生成。先修改后端契约，再执行 `pnpm run openapi`；不要把手工修复藏在生成文件中。
- 不提交本地凭据、构建产物、`node_modules/` 或临时截图。

## 验证与交付

- 使用 `package.json` 声明的 Node.js 和 pnpm 版本，先执行 `pnpm install --frozen-lockfile`。
- 代码变更运行 `pnpm run lint` 和 `pnpm run build`。涉及页面时同时检查直接打开目标路由及从应用内导航的结果。
- 启动管理端前确认后端 OpenAPI 端点可达；开发时的页面可用不代表邮件、对象存储或 AI 外部集成可用。
- 提交前执行 `git diff --check` 并只暂存本次改动。提交、推送和部署遵循用户当次授权。
