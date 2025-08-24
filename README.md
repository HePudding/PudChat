# PudChat

基于 React 18 + TypeScript + Vite + TailwindCSS 的三栏式角色扮演聊天应用，界面参考 ChatGPT 的简洁布局并加入轻微科技感。所有界面文案均为中文，数据保存在浏览器 `localStorage` 中。

## 快速开始

> 下面命令以 pnpm 为例；你也可以使用 npm。

```bash
git clone https://github.com/HePudding/PudChat.git
cd PudChat
pnpm install
pnpm --filter web dev
```

打开浏览器访问提示的本地地址即可。

### 键盘快捷键

- **Enter**：发送消息
- **Shift + Enter**：换行
- **Esc**：关闭当前弹窗

## Roadmap

### Completed

- 全新三栏布局（左：角色列表 / 中：聊天 / 右：角色简介）。
- 普通记忆：删除单条消息、删除会话、新建会话。
- 长期记忆：黄条提示（可关闭）、合并会话占位、隐藏会话标签、清除全部记忆（二次确认）、同步状态占位。
- 角色编辑器：角色名/头像/简介/系统提示词（支持导入 .md/.txt）、立绘差分（情绪预设）。
- 模型管理：默认无供应商；可新增供应商并选择适配器（OpenAI/Anthropic/Gemini/Custom），填写 Base URL / API Key / 备注；详情可手动新增/删除模型；顶部下拉可快速切换模型。
- 数据持久化：localStorage（roles / providers）。
- 模态滚动锁定与内容滚动。

### Planned / Not yet implemented

- 真正的账户/登录流程（当前右上角“账户”按钮仅占位）。
- 与后端对接的“长期记忆·服务端同步”。
- 模型调用签名适配：基于不同适配器自动设置 headers/paths（当前仅前端占位）。
- 模型的扩展属性（速率/费用/并发）与配额预警。
- 导入/导出整套角色与会话（JSON）。
- 可选的主题自定义（配色/字体密度）。

## 依赖

- React 18
- Vite
- TypeScript
- TailwindCSS
- lucide-react
- 可选：@radix-ui 组件

## 许可协议

本项目遵循 **AGPL-3.0** 许可协议。

> **注意**：右上角的“账户”按钮目前仅为占位，不具有任何登录功能。

## 作者

- GitHub：[@HePudding](https://github.com/HePudding)
- Bilibili：[https://space.bilibili.com/383882267](https://space.bilibili.com/383882267)
- 爱发电：https://afdian.com/a/hepudding
