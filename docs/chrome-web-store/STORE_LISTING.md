# NOVA Chrome Web Store listing / Chrome 应用商店上架资料

Prepared against the official Chrome Web Store publishing, listing-image, and privacy-field guidance on 2026-08-24.

## Product identity

- Default language: English
- Additional locale: 简体中文 (`zh_CN`)
- Category: Tools / 工具
- Homepage: `https://github.com/CalvinQin/nova-ai-new-tab`
- Support: `https://github.com/CalvinQin/nova-ai-new-tab/issues`
- Privacy policy: `https://github.com/CalvinQin/nova-ai-new-tab/blob/main/PRIVACY.md`
- Mature content: No
- Pricing / in-app purchases: Free / None
- Distribution: Public, all supported regions

## English listing

### Title

NOVA — AI Command New Tab

### Summary

A calm, keyboard-first new tab for AI, search, commands, and the web.

### Detailed description

NOVA replaces your new tab page with one calm command surface. Type once, then choose AI, Search, a URL, a calculation, or a slash command.

Key features:

- Route prompts to ChatGPT, Claude, Gemini, Perplexity, Grok, DeepSeek, 豆包, Kimi, 通义千问, or 腾讯元宝 without a NOVA AI backend.
- Search Google, 百度, Bing, DuckDuckGo, Brave, YouTube, GitHub, Reddit, Bilibili, Zhihu, Xiaohongshu, or Taobao.
- Detect website addresses, localhost URLs, IPv4 addresses, and simple calculations automatically.
- Add, edit, remove, undo, and drag up to 12 quick links.
- Use Tab, arrow keys, Enter, Escape, Command/Ctrl K, and the command palette throughout the experience.
- Optionally monitor up to two named servers and three endpoint checks per server, using a provider preset or your own label.
- Choose light, dark, or system appearance, five restrained accents, reduced motion, and Focus Mode.
- Keep settings and recent destination metadata on your device with no analytics or prompt history.

NOVA requests Chrome's `storage` permission by default. Its Server Pulse feature requests optional access to the exact HTTP/HTTPS endpoint origins you configure only after you press **Connect & verify**. Once approved, it can refresh health and latency while the new-tab page is visible at the cadence you choose. It has no backend, background worker, remote code, advertising, analytics, or AI API credentials. Source code and privacy details are available from the project homepage.

## 简体中文商店文案

### 标题

NOVA — AI 命令新标签页

### 摘要

一个安静、键盘优先的新标签页，统一连接 AI、搜索、命令与常用网站。

### 详细说明

NOVA 把浏览器新标签页变成一个安静、统一的命令入口。输入一次，即可选择 AI、网页搜索、网址、计算器或斜杠命令。

主要功能：

- 无需 NOVA AI 后端，直接把提示词交给 ChatGPT、Claude、Gemini、Perplexity、Grok、DeepSeek、豆包、Kimi、通义千问或腾讯元宝。
- 支持 Google、百度、Bing、DuckDuckGo、Brave、YouTube、GitHub、Reddit、哔哩哔哩、知乎、小红书和淘宝搜索。
- 自动识别普通网址、localhost、IPv4 地址与简单计算表达式。
- 最多管理 12 个快捷网站，支持添加、编辑、删除、撤销和拖拽排序。
- 全程支持 Tab、方向键、Enter、Esc、Command/Ctrl K 与命令面板。
- 可选监控最多 2 台命名服务器、每台最多 3 项端点检测，可使用厂商预设或自定义名称。
- 提供浅色、深色、跟随系统、五种克制强调色、减少动画和专注模式。
- 设置和最近目标元数据仅保存在本机，无统计分析，也不保存提示词历史。

NOVA 默认只申请 Chrome 的 `storage` 权限。服务器状态面板只会在你点击“连接并检测”后，为已配置的精确 HTTP/HTTPS 端点来源申请可选访问权限。授权后，可在新标签页可见期间按你选择的频率刷新健康状态和延迟。项目没有后端、后台 Worker、远程代码、广告、统计分析或 AI API 凭证。源码和完整隐私说明可在项目主页查看。

## Privacy practices / 隐私披露

### Single purpose

Replace the browser's new tab page with a keyboard-first launcher that routes user-entered commands to a chosen AI service, search engine, website, or local calculation.

### `storage` permission justification

The `storage` permission saves the user's chosen mode, AI provider, search engine, appearance preferences, quick links, onboarding state, and recent destination metadata locally so those choices persist across new tabs. Prompts and search queries are not saved in Recent.

### Optional host permission justification

The optional `http://*/*` and `https://*/*` declarations allow a user-selected Server Pulse endpoint to be checked from the new-tab page. NOVA requests only the exact configured origins after a user clicks **Connect & verify**. Once authorized, it performs the user-selected interval only while the new-tab page is visible; it does not read page content, collect credentials, or proxy requests through a NOVA service.

### Remote code

No. All executable JavaScript and fonts are packaged with the extension. User-supplied HTTPS favicon images are displayed as images and are never executed as code.

### Data handling notes for the dashboard

- Stored locally: preferences, onboarding state, custom quick-link names/URLs/icons, and recent destination labels/origins.
- Stored locally when Server Pulse is used: server label, provider, endpoint URLs, health label, latency, and check time.
- Processed transiently when Server Pulse is used: a direct browser `GET` to the endpoint the user explicitly configured and approved, at the selected cadence while the new-tab page is visible.
- Processed transiently: prompt/search text while the user is typing and when routing it to the destination selected by that user.
- Not collected by a NOVA server: there is no NOVA backend, account system, analytics, telemetry, advertising, or developer access to local extension data.
- Never sold, used for unrelated purposes, used for advertising or lending, or read by humans.
- Third-party AI/search websites process data only after the user deliberately navigates to them; their own privacy policies then apply.

## Reviewer test instructions

1. Install the submitted package and open a new tab.
2. Complete the three-step onboarding; no account or credentials are required.
3. Type `Plan a product launch`, press Tab to switch between AI and Search, and use the arrow keys to inspect suggestions.
4. Type `125 * 8` to verify the local calculator result.
5. Type `/settings`, `/focus`, or `/github nova` to verify slash commands.
6. Add and edit a quick link, then drag it by the upper-left grip; it should remain under the pointer and settle at the chosen slot.
7. Open Settings → Status, add a server and endpoint, then choose **Connect & verify**. Approve the browser's optional host-access prompt for that endpoint and confirm the panel shows the result.
8. Open Settings → Privacy to clear recent destination metadata.

No paid service, test account, external hardware, or special environment is required.

## Asset manifest

- `assets/nova-store-icon-128.png` — 128×128 PNG
- `assets/nova-screenshot-01-light.png` — 1280×800 PNG
- `assets/nova-screenshot-02-suggestions.png` — 1280×800 PNG
- `assets/nova-screenshot-03-command-dark.png` — 1280×800 PNG
- `assets/nova-screenshot-04-settings.png` — 1280×800 PNG
- `assets/nova-screenshot-05-focus.png` — 1280×800 PNG
- `assets/nova-promo-small-440x280.png` — optional small promo tile
- `assets/nova-promo-marquee-1400x560.png` — optional marquee tile
