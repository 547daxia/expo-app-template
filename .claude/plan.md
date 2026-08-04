# Code Review 高优先级修复计划 ✅ 已完成

## 修复 1：认证 Hydrate 竞态 — 添加 Loading 状态

**问题**：`app/_layout.tsx` 在 `status === 'idle'` 时返回 `null`，用户在 hydrate 完成前看到空白屏。Splash screen 已经在 idle 期间保持显示，但如果 `onLayoutRootView` 在 hydrate 完成前被调用，splash 会提前隐藏。

**修复方案**：将 splash 隐藏逻辑与 auth status 联动，确保 splash 只在 auth hydrate 完成后隐藏（即 status !== 'idle'）。当前代码已经在 idle 时 return null（不触发 onLayout），所以实际上 splash 会一直显示直到 hydrate 完成。但问题在于如果 hydrate 失败或超时没有兜底。

**实际修改**：
- `app/_layout.tsx`：将 splash 隐藏与 auth status 直接绑定在 useEffect 中，增加健壮性
- 不需要额外 Loading 组件，因为 splash screen 已覆盖 idle 状态

重新审视后，当前实现其实已经是安全的：idle 时 return null → 不渲染 → 不触发 onLayout → splash 不隐藏。真正的问题是缺少 hydrate 超时保护。添加一个 timeout fallback：如果 hydrate 超过 5 秒仍为 idle，强制设为 signOut。

## 修复 2：Token 自动注入和 401 刷新

**问题**：API 客户端没有注入 Authorization header，也没有 token refresh 逻辑。

**修改文件**：
- `src/lib/api/client.tsx` — 添加 request interceptor（注入 token）和 response interceptor（401 刷新）

**设计**：
1. Request interceptor：从 `getToken()` 读取 access token，设置 `Authorization: Bearer <token>`
2. Response interceptor：捕获 401，用 refresh token 调用刷新接口，重试原请求
3. 刷新失败时调用 `signOut()` 退出登录
4. 并发请求的 401 排队等待同一个刷新操作（防止多次刷新）

## 修复 3：补充测试覆盖

**新增测试文件**：
1. `src/lib/api/client.test.ts` — 测试 interceptors（token 注入、401 刷新、刷新失败退出）
2. `src/features/feed/api.test.ts` — 测试 usePosts、usePost、useAddPost hooks
3. `src/lib/api/utils.test.ts` — 测试分页工具函数（getUrlParameters、normalizePages、getNextPageParam）

**测试策略**：
- API client test：mock axios adapter，验证 header 注入和 401 重试逻辑
- Feed API test：使用 msw 或直接 mock axios client，配合 react-query-kit 的测试模式
- Utils test：纯函数，直接测试输入输出

## 实施顺序

1. 修复 2（Token 注入和刷新）— 最核心，是其他逻辑的基础
2. 修复 1（Hydrate 超时保护）— 简单改动
3. 修复 3（补充测试）— 覆盖上述新增逻辑

## 文件变更清单

- 修改 `src/lib/api/client.tsx` — 添加 interceptors
- 修改 `src/app/_layout.tsx` — 添加 hydrate timeout
- 新增 `src/lib/api/client.test.ts`
- 新增 `src/features/feed/api.test.ts`
- 新增 `src/lib/api/utils.test.ts`
