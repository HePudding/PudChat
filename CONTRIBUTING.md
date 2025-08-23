# Contributing to PudChat

感谢你对 **PudChat** 的兴趣！🎉  
这是一个完全开源的 AI 伴侣 Web 应用，欢迎任何形式的贡献：报告问题、提交代码、改进文档、提出想法。

---

## 🐛 提交 Issue
- 在 [Issues](https://github.com/HePudding/PudChat/issues) 页面提交。  
- 请尽量提供：
  - 使用环境（浏览器 / 系统 / 版本）  
  - 复现步骤  
  - 期望结果与实际结果  
  - 截图或报错信息（如果有）

---

## 🔀 提交 Pull Request
1. Fork 本仓库，并 clone 到本地。  
2. 创建新分支：
   ```bash
   git checkout -b feat/your-feature-name
````

3. 在本地修改代码，并确保：

   * `pnpm install` 可正常安装依赖
   * `pnpm lint && pnpm build` 能通过
4. 提交更改并推送到你 Fork 的仓库：

   ```bash
   git push origin feat/your-feature-name
   ```
5. 在 GitHub 上发起 Pull Request，并简要描述更改内容。

---

## 📝 Commit 信息规范

请使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 风格：

* `feat:` 新功能
* `fix:` 修复 bug
* `docs:` 文档更新
* `style:` 样式/格式调整（不影响逻辑）
* `refactor:` 重构（既不是新增功能，也不是修复 bug）
* `test:` 测试相关改动
* `chore:` 其他维护性改动

示例：

```
feat(chat): add streaming renderer for messages
fix(adapter): correct OpenAI error handling
```

---

## 🌱 分支命名约定

* 功能：`feat/xxx`
* 修复：`fix/xxx`
* 文档：`docs/xxx`
* 重构：`refactor/xxx`

示例：

```
feat/role-import
fix/chat-scroll
```

---

## ⚙️ 开发环境

* Node.js >= 18
* pnpm >= 9
* 推荐编辑器：VSCode（安装 ESLint/Prettier 插件）

启动开发环境：

```bash
pnpm install
pnpm dev
```

---

## 🎨 代码风格

* 使用 TypeScript 编写代码。
* 严格遵循 ESLint + Prettier 配置。
* UI 尽量保持 **简洁、干净**，避免过度修饰。
* 所有新功能请写最小测试或自测说明。

---

## ✅ 测试

未来会逐步加入 Playwright / Vitest 测试。
如果你提交的改动涉及核心逻辑，请至少添加对应的单元测试或更新现有测试。

---

## 💡 建议与讨论

* 你可以在 [Discussions](https://github.com/HePudding/PudChat/discussions) 提出新功能想法。
* 鼓励大家分享角色卡、UI 改进方案、模型适配器。

---

谢谢你的贡献！💖
让我们一起把 PudChat 打造成一个开放、简洁、自由的 AI 伴侣应用。
