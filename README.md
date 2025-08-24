# PudChat

一个完全开源的 **AI 伴侣 Web 应用**。默认纯前端，但也提供可选后端组件：支持登录系统与云端存储。用户使用自己的 API Key，自由选择模型对话；支持**自定义角色头像**与**聊天背景**，默认对话界面力求**简洁**、**干净**、**少打扰**。

> 本项目由 AI 协助构建（Codex + ChatGPT），遵循 **AGPL-3.0** 协议开源。

---

## ✨ 特性

- 🧩 **默认纯 Web，可选后端组件**
  默认不托管你的密钥，数据仅保存在浏览器（localStorage / IndexedDB）；启用后端时，可端到端加密同步到云端。

- 🔌 **多模型可插拔**  
  计划支持 OpenAI、OpenRouter（以及后续更多提供商）。用户可在设置页切换模型与自带 Key。

- 🎭 **角色与外观**  
  - 角色卡：导入/管理/应用到会话。  
  - **自定义角色头像**（上传 URL 或本地文件）。  
  - **自定义聊天背景**（纯色 / 图片 / 模糊玻璃效果可选）。  
  - 默认主题走 **极简风格**：少边框、弱分割、专注文本可读性。

- 💾 **本地持久化**
  会话、角色卡、提示词与界面设置持久化在本地；支持一键导出/导入。

- 🗄️ **后端登录与历史同步（可选）**
  提供登录系统，可将聊天记录保存至服务器；API Key 可选择仅本地保存或端到端加密上传云端。

- 🔒 **隐私与安全**  
  不收集、不过传任何对话或密钥；一键清空本地数据。

---

## 🧑‍🤝‍🧑 角色广场与致谢

- 推荐使用 **KouriChat 的角色档案馆** 创建与浏览角色卡：  
  👉 https://kourichat.com  
- PudChat 将提供：  
  - “前往角色档案馆”跳转按钮；  
  - **从 URL/Gist 导入角色卡** 的能力；  
  - 本地收藏与应用到会话。  
- **声明**：PudChat 与 **KouriChat 无任何隶属或合作关系**，仅作为优秀社区资源进行推荐与致谢。

---

## 🚀 快速开始

> 下面命令以 pnpm 为例；你也可以使用 npm / yarn。

```bash
# 克隆仓库
git clone https://github.com/HePudding/PudChat.git
cd PudChat

# 安装依赖
pnpm install

# 启动开发环境
pnpm dev
````

打开浏览器访问提示的本地地址：

1. 进入 **设置**：选择模型提供商，填入你的 API Key（可仅本地保存或端到端加密上传）。
2. （可选）前往 [https://kourichat.com](https://kourichat.com) 浏览并复制角色卡；回到 PudChat **导入角色卡**。
3. 在 **对话页** 开始聊天；可在**外观**里设置角色头像与聊天背景。

---

## 🛠️ 项目结构（MVP 规划）

```
/apps/web                # Next.js 前端
/packages/core           # 会话/消息/存储/适配器接口（TypeScript）
/packages/adapters       # 模型适配器（openai/ openrouter/ ...）
/packages/ui             # UI 组件与极简主题
```

---

## ⚙️ 配置与数据

* **API Key 存储**：默认仅存于浏览器（localStorage），可选择端到端加密上传云端。
* **会话与资源**：默认存于 IndexedDB；启用后端后会同步到服务器，可在设置中导出/导入。
* **清空数据**：设置页提供“一键清空本地数据”。

---

## 🧭 路线图（简要）

*  ✅ OpenAI / OpenRouter 适配器（流式输出）
*  ✅ 设置页（提供商/Key/模型选择、本地安全提示）
*  ✅ 对话页（极简 UI、停止/重试、消息复制、Token 信息）
* [ ] 角色卡导入/管理（含头像）
* [ ] 背景自定义（纯色/图片/模糊）
* [ ] 本地导出/导入与重置
* [ ] 账户功能实现
* [ ] 基础无障碍与移动端适配

---

## 🤝 贡献

欢迎提交 Issue / PR！建议遵循如下规范：

* Commit 信息：`type(scope): message`，如 `feat(chat): add streaming renderer`
* PR 内附上动图或截图、以及简单测试说明
* 请勿提交 `.env`、密钥或个人隐私数据

---

## 📜 许可协议

本项目使用 **AGPL-3.0** 协议。任何公开托管或提供网络访问的修改版本，必须同样开源并提供源代码。详见 [LICENSE](./LICENSE)。

---

## 👤 作者

* GitHub：[@HePudding](https://github.com/HePudding)
* Bilibili：[https://space.bilibili.com/383882267](https://space.bilibili.com/383882267)
* 爱发电：https://afdian.com/a/hepudding
