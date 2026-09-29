# Stephen Admin 项目说明

## 目标与范围

本仓库是 [stephen-cloud](https://github.com/StephenQiu30/stephen-cloud) 的管理端，使用 Umi Max、React、Ant Design 和 TypeScript。当前页面覆盖登录、用户、帖子、评论、通知、AI 对话记录、审计日志和个人中心。后端服务及中间件不在本仓库内。

## 代码地图

| 路径 | 职责 |
| --- | --- |
| `config/routes.ts` | 页面路由和访问控制入口 |
| `config/config.ts` | Umi、OpenAPI 与构建配置 |
| `config/proxy.ts` | 预发布及测试环境代理配置 |
| `src/pages/` | 页面实现 |
| `src/components/` | 共享 UI 组件 |
| `src/services/` | OpenAPI 生成的后端请求客户端及示例代码 |
| `src/requestConfig.ts` | 统一请求与错误处理 |
| `src/constants/index.ts` | 开发及生产 API 地址常量 |

## 运行与契约

开发模式使用 `src/constants/index.ts` 指定的网关地址，默认需要本机 8080 端口上的后端。`pnpm run openapi` 从后端各服务的 `/api/v3/api-docs` 生成客户端；只有后端服务启动后才能执行。直接访问登录页使用 `/user/login`。

页面是否能够构建、登录页是否展示与真实业务接口是否可用是不同的验证层级。变更 API 字段时，先改后端契约，再重新生成客户端并运行类型检查。启动、构建和验证命令见 [README.md](README.md)。
