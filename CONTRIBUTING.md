# 贡献指南

感谢你考虑为黑暗之魂系列文本数据库项目做出贡献！

## 行为准则

请遵守以下基本准则：

- 尊重所有贡献者
- 保持友好和专业
- 接受建设性的批评
- 关注对项目最有利的事情

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请创建一个 Issue 并包含：

1. **清晰的标题**：简要描述问题
2. **重现步骤**：详细说明如何重现问题
3. **预期行为**：描述你期望发生什么
4. **实际行为**：描述实际发生了什么
5. **环境信息**：
   - 浏览器和版本
   - 操作系统
   - 屏幕截图（如果适用）

### 提出新功能

如果你有新功能的想法：

1. 先检查 Issues 中是否已有类似建议
2. 创建一个 Feature Request Issue
3. 详细描述功能和使用场景
4. 说明为什么这个功能有价值

### 提交代码

#### 开发流程

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上 Fork 项目
   # 克隆你的 Fork
   git clone https://github.com/your-username/DarkSouls-Tome.git
   cd DarkSouls-Tome
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **开发**
   ```bash
   npm run dev
   ```

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 填写 PR 模板
   - 等待审核

#### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构（既不是新功能也不是 Bug 修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**：
```
feat(search): add fuzzy search support

- Implement fuzzy matching algorithm
- Add search result highlighting
- Update search bar UI

Closes #123
```

#### 代码规范

**TypeScript**：
- 使用 TypeScript 类型注解
- 避免使用 `any` 类型
- 导出的函数和组件必须有类型定义

**Vue 组件**：
- 使用 Composition API
- 使用 `<script setup>` 语法
- Props 和 Emits 必须有类型定义
- 使用 scoped 样式

**样式**：
- 使用 SCSS
- 遵循 BEM 命名规范
- 使用 CSS 变量
- 移动优先的响应式设计

**命名规范**：
- 组件：PascalCase（如 `ItemCard.vue`）
- 文件：kebab-case（如 `use-game-data.ts`）
- 变量/函数：camelCase（如 `loadData`）
- 常量：UPPER_SNAKE_CASE（如 `GAME_NAMES`）

#### 代码审查

PR 会经过以下审查：

1. **代码质量**：
   - 是否遵循项目规范
   - 是否有适当的类型定义
   - 是否有必要的注释

2. **功能完整性**：
   - 是否实现了预期功能
   - 是否处理了边界情况
   - 是否有错误处理

3. **性能影响**：
   - 是否影响加载性能
   - 是否有不必要的重渲染
   - 是否有内存泄漏

4. **用户体验**：
   - 是否符合设计规范
   - 是否有良好的交互反馈
   - 是否支持移动端

## 开发指南

### 项目结构

```
src/
├── assets/         # 静态资源
│   └── styles/    # 全局样式
├── components/     # 可复用组件
├── views/          # 页面组件
├── router/         # 路由配置
├── stores/         # 状态管理
├── composables/    # 组合式函数
├── utils/          # 工具函数
├── types/          # TypeScript 类型
└── data/           # 游戏数据
```

### 添加新组件

1. 在 `src/components/` 创建组件文件
2. 使用 TypeScript 和 Composition API
3. 添加 Props 和 Emits 类型定义
4. 使用 scoped 样式
5. 在需要的地方导入使用

示例：
```vue
<template>
  <div class="my-component">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<style scoped lang="scss">
.my-component {
  // 样式
}
</style>
```

### 添加新页面

1. 在 `src/views/` 创建页面组件
2. 在 `src/router/index.ts` 添加路由
3. 确保页面响应式
4. 添加适当的加载和错误状态

### 添加新功能

1. 在 `src/composables/` 创建组合式函数
2. 使用 TypeScript 类型
3. 返回响应式数据和方法
4. 添加必要的注释

### 样式开发

使用 SCSS 变量和混入：

```scss
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.my-component {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  
  @include responsive(mobile) {
    // 移动端样式
  }
}
```

## 测试

目前项目还没有自动化测试，但请确保：

1. 手动测试所有功能
2. 在不同浏览器测试
3. 在移动端测试
4. 检查控制台是否有错误

## 文档

如果你的更改需要文档更新：

1. 更新相关的 `.md` 文件
2. 确保文档清晰易懂
3. 添加代码示例（如果适用）
4. 更新 README（如果需要）

## 问题和讨论

- **Bug 报告**：使用 GitHub Issues
- **功能请求**：使用 GitHub Issues
- **问题讨论**：使用 GitHub Discussions
- **即时交流**：（如果有的话）

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

## 致谢

感谢所有贡献者的付出！你的贡献让这个项目变得更好。

---

⚔️ **Praise the Sun!** ☀️
