<div align="center">
  <img src="docs/assets/nova-cover.png" alt="NOVA — Think. Search. Go." width="100%" />

  <br />

  **一个安静、键盘优先的 AI 原生浏览器新标签页。**

  [English](README.md) · [简体中文](README.zh-CN.md) · [观看实机演示](docs/assets/nova-demo.mp4)

  ![Manifest V3](https://img.shields.io/badge/Manifest-V3-232923?style=flat-square)
  ![测试](https://img.shields.io/badge/tests-50%20passed-4c8b61?style=flat-square)
  ![权限](https://img.shields.io/badge/permission-storage%20%2B%20on--demand%20host-4c8b61?style=flat-square)
  ![许可证](https://img.shields.io/badge/license-MIT-232923?style=flat-square)
</div>

NOVA 把每个浏览器新标签页变成一个统一入口：询问 AI、搜索网页、打开网址、即时计算，或跳转到常用网站，全程无需切换思路和界面。

![NOVA 浅色主题](docs/assets/nova-light.png)

## 为什么是 NOVA

- **一个输入框完成所有动作：** AI、搜索、网址、计算器与斜杠命令使用同一套可预测交互。
- **直达你选择的目标，不做中转代理：** NOVA 直接把操作交给你选择的 AI 服务、搜索引擎或网站。
- **键盘优先：** `⌘/Ctrl K` 聚焦输入框，`Tab` 切换 AI/搜索，`⌘/Ctrl ⇧ P` 打开命令面板。
- **属于你的快捷入口：** 最多添加 12 个网站，支持编辑、删除、撤销与拖拽排序。
- **安静的系统脉冲：** 可选展示最多 2 台服务器、每台最多 3 项端口/端点健康度，内置厂商预设、真实 HTTP(S) 延迟和可见标签页实时刷新。
- **克制而精致：** 支持浅色、深色、跟随系统、五种强调色、专注模式与减少动态效果。
- **从设计上保护隐私：** 无统计分析、无 API Key、无提示词历史；只有你主动检测时才申请对应端点的访问权限。

![NOVA 深色主题与智能建议](docs/assets/nova-command-dark.png)

## 安装

### 从 Release 安装

1. 在 [Releases](../../releases) 下载 `nova-ai-new-tab-v0.3.1.zip`。
2. 解压文件。
3. 在 Chrome、Edge、Brave 或其他 Chromium 浏览器打开 `chrome://extensions`。
4. 开启右上角的 **开发者模式**。
5. 点击 **加载已解压的扩展程序**，选择解压后的文件夹。
6. 打开新标签页，完成三步初始化。

### 从源码构建

```bash
git clone https://github.com/CalvinQin/nova-ai-new-tab.git
cd nova-ai-new-tab
npm ci
npm run build
```

构建完成后，在 `chrome://extensions` 中加载生成的 `dist/` 文件夹。

## 支持的目标

可从内置 AI 与网页搜索目标中选择，也可以添加自己的快捷网站。有稳定查询链接的平台会直接接收内容；没有稳定链接的平台由 NOVA 复制提示词并打开你选择的网站，用户自行粘贴，整个过程不经过 NOVA 服务器。

## 常用命令

输入 `/` 即可发现设置、外观、快捷方式、专注模式和已配置目标的命令。

| 快捷键 | 功能 |
| --- | --- |
| `⌘/Ctrl K` | 聚焦通用命令栏 |
| `Tab` | 切换 AI 与搜索模式 |
| `↑` / `↓` | 浏览建议项 |
| `Enter` | 执行当前动作 |
| `⌘/Ctrl ⇧ P` | 打开命令面板 |
| `Esc` | 关闭或清空当前界面 |

![NOVA 设置中心](docs/assets/nova-settings.png)

## 隐私

NOVA 使用 `chrome.storage.local` 在本机保存设置、快捷方式、服务器监控配置和最近访问的**目标元数据**，明确不保存提示词或搜索内容。点击“连接并检测”并同意端点访问后，System Pulse 可在新标签页可见期间每 30 秒刷新一次 HTTP(S) 健康状态和延迟；可在设置中改频率或关闭。项目没有后端、后台 Worker、统计分析、远程代码或 AI API 凭证。详见 [PRIVACY.md](PRIVACY.md)。

阿里云价格项目怎么接入，见[服务器状态小白说明](docs/SERVER-PULSE-GUIDE.md)：只需一个公开 HTTP(S) 健康网址，绝不填写 AccessKey、SSH 密码或宝塔登录信息。

## 开发与验证

```bash
npm run dev      # 启动 Vite 本地开发
npm run check    # ESLint + 自动化测试 + 正式构建
npm run icons    # 重新生成扩展图标
npm run store:assets # 重新生成并校验 Chrome 应用商店素材
```

技术栈包括 React、TypeScript、Vite、Zustand、Framer Motion、dnd-kit、Lucide 与 Simple Icons，正式产物遵循 Chrome Manifest V3。

产品流程、组件边界、隐私模型与扩展点见 [架构说明](docs/ARCHITECTURE.md)。

## 参与贡献

欢迎提交 Issue 和范围清晰的 Pull Request。参与前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

[MIT](LICENSE) © 2026 Haoqi Qin。
