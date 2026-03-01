# Node.js 版本升级修复

## 问题描述

GitHub Actions 构建失败，错误信息：

```
You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+.
Please upgrade your Node.js version.

SyntaxError: The requested module 'node:util' does not provide an export named 'styleText'
```

## 原因分析

- **Vite 8.0** 要求 Node.js 版本 **20.19+** 或 **22.12+**
- GitHub Actions 工作流使用的是 Node.js **18.20.8**
- Node.js 18 不支持 `node:util` 模块的 `styleText` 导出

## 解决方案

### 修改文件
`.github/workflows/deploy.yml`

### 修改内容

将两处 Node.js 版本从 `18` 升级到 `20`：

```yaml
# 修改前
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'

# 修改后
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

### 影响范围

修改了两个 job：
1. **lint** job - 类型检查和构建验证
2. **build** job - 生产环境构建

## 验证结果

### 本地构建
✅ 本地使用 Node.js 20+ 构建成功

```
✓ 237 modules transformed
✓ built in 8.73s
PWA v1.2.0
precache 3276 entries (126255.79 KiB)
```

### GitHub Actions
等待推送后自动触发构建验证

## 技术说明

### Vite 8 的 Node.js 要求

Vite 8.0 (beta) 使用了 Node.js 的新特性：
- `node:util` 模块的 `styleText` API（Node.js 20.11+）
- 更好的 ESM 支持
- 性能优化

### Node.js 版本选择

选择 Node.js 20 而不是 22 的原因：
- Node.js 20 是 LTS（长期支持）版本
- 更稳定，生态系统支持更好
- 满足 Vite 8 的最低要求（20.19+）

## 相关提交

```
54a3f96 fix: 升级 GitHub Actions Node.js 版本到 20
```

## 后续建议

### 1. 本地开发环境
确保本地 Node.js 版本 >= 20.19：

```bash
node --version  # 应该显示 v20.19+ 或 v22.12+
```

如果版本过低，建议升级：
- 使用 nvm: `nvm install 20 && nvm use 20`
- 或从官网下载: https://nodejs.org/

### 2. 团队协作
在 `package.json` 中添加 engines 字段：

```json
{
  "engines": {
    "node": ">=20.19.0",
    "npm": ">=10.0.0"
  }
}
```

### 3. CI/CD 监控
- 定期检查 Node.js LTS 版本更新
- 关注 Vite 版本要求变化
- 保持依赖版本同步

## 参考资料

- [Vite 8.0 发布说明](https://vitejs.dev/blog/)
- [Node.js 版本发布计划](https://nodejs.org/en/about/releases/)
- [GitHub Actions setup-node](https://github.com/actions/setup-node)

---

最后更新：2026-03-01
