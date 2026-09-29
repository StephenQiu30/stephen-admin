# Stephen Admin

[Stephen Cloud](https://github.com/StephenQiu30/stephen-cloud) 的管理端，基于 React 19、Umi Max 4、Ant Design 6 和 TypeScript。提供登录、用户、帖子、评论、通知、AI 对话记录、业务日志与个人中心页面。项目边界和代码地图见 [PROJECT.md](PROJECT.md)，仓库协作规则见 [AGENTS.md](AGENTS.md)。

## 本地运行

需要 Node.js 22 或更高版本、pnpm 12，以及运行中的 Stephen Cloud 网关（默认 `http://localhost:8080/api`）。首次安装和启动：

```bash
pnpm install --frozen-lockfile
pnpm run start:dev
```

浏览器打开 <http://localhost:8000/user/login>。登录等业务功能需要后端及其依赖可用；前端页面加载成功不代表邮件、对象存储或 AI 外部服务已配置。

## API 契约

运行时请求由 [src/requestConfig.ts](src/requestConfig.ts) 统一处理。开发环境默认请求本机网关；构建产物默认请求同源 `/api`，部署时需将该路径反向代理到后端。跨域部署可在构建时提供公开的 API 基址，例如：

```bash
UMI_APP_API_BASE_URL=https://api.example.com/api pnpm run build
```

`UMI_APP_API_BASE_URL` 会进入浏览器构建产物，不能用于存放密钥。后端各服务的 OpenAPI 地址配置在 [config/config.ts](config/config.ts)。后端服务启动后，可执行 `pnpm run openapi` 重新生成 `src/services/` 下的客户端；不要手改生成结果。默认 schema 地址使用本机 8081、8082、8083、8084、8085、8086、8087 和 8089 端口。

## 目录

| 路径 | 职责 |
| --- | --- |
| `config/routes.ts` | 管理端路由 |
| `config/config.ts` | Umi、OpenAPI 和构建配置 |
| `src/pages/` | 登录与管理页面 |
| `src/components/` | 共享组件 |
| `src/services/` | OpenAPI 客户端与示例代码 |
| `src/requestConfig.ts` | 请求拦截、认证信息和错误处理 |
| `src/constants/index.ts` | 默认 API 基址及其他常量 |

## 验证和构建

```bash
pnpm run lint
pnpm run build
```

`lint` 包含 Biome 检查和 TypeScript 类型检查；构建产物位于 `dist/`。CI 在推送和拉取请求时运行相同门禁。`@ant-design/pro-components` 当前使用 Ant Design 6 兼容的预发行版本，升级时需额外检查页面交互。

## 协议

本项目采用 [MIT License](LICENSE)。
