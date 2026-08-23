# NOVA Chrome Web Store listing / Chrome 应用商店上架资料

Prepared against the official Chrome Web Store publishing, listing-image, and privacy-field guidance on 2026-08-24.

## Product identity

- Default language: English
- Additional locale: 简体中文 (`zh_CN`)
- Category: Productivity / 工作流程与规划
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

- Route prompts to ChatGPT, Claude, Gemini, Perplexity, Grok, or DeepSeek without a NOVA AI backend.
- Search Google, Bing, DuckDuckGo, Brave, YouTube, GitHub, Reddit, Bilibili, Zhihu, Xiaohongshu, or Taobao.
- Detect website addresses, localhost URLs, IPv4 addresses, and simple calculations automatically.
- Add, edit, remove, undo, and drag up to 12 quick links.
- Use Tab, arrow keys, Enter, Escape, Command/Ctrl K, and the command palette throughout the experience.
- Choose light, dark, or system appearance, five restrained accents, reduced motion, and Focus Mode.
- Keep settings and recent destination metadata on your device with no analytics or prompt history.

NOVA requests only Chrome's `storage` permission. It has no host permissions, background worker, remote code, advertising, analytics, or AI API credentials. Source code and privacy details are available from the project homepage.

## 简体中文商店文案

### 标题

NOVA — AI 命令新标签页

### 摘要

一个安静、键盘优先的新标签页，统一连接 AI、搜索、命令与常用网站。

### 详细说明

NOVA 把浏览器新标签页变成一个安静、统一的命令入口。输入一次，即可选择 AI、网页搜索、网址、计算器或斜杠命令。

主要功能：

- 无需 NOVA AI 后端，直接把提示词交给 ChatGPT、Claude、Gemini、Perplexity、Grok 或 DeepSeek。
- 支持 Google、Bing、DuckDuckGo、Brave、YouTube、GitHub、Reddit、哔哩哔哩、知乎、小红书和淘宝搜索。
- 自动识别普通网址、localhost、IPv4 地址与简单计算表达式。
- 最多管理 12 个快捷网站，支持添加、编辑、删除、撤销和拖拽排序。
- 全程支持 Tab、方向键、Enter、Esc、Command/Ctrl K 与命令面板。
- 提供浅色、深色、跟随系统、五种克制强调色、减少动画和专注模式。
- 设置和最近目标元数据仅保存在本机，无统计分析，也不保存提示词历史。

NOVA 只申请 Chrome 的 `storage` 权限，没有主机权限、后台 Worker、远程代码、广告、统计分析或 AI API 凭证。源码和完整隐私说明可在项目主页查看。

## Privacy practices / 隐私披露

### Single purpose

Replace the browser's new tab page with a keyboard-first launcher that routes user-entered commands to a chosen AI service, search engine, website, or local calculation.

### `storage` permission justification

The `storage` permission saves the user's chosen mode, AI provider, search engine, appearance preferences, quick links, onboarding state, and recent destination metadata locally so those choices persist across new tabs. Prompts and search queries are not saved in Recent.

### Remote code

No. All executable JavaScript and fonts are packaged with the extension. User-supplied HTTPS favicon images are displayed as images and are never executed as code.

### Data handling notes for the dashboard

- Stored locally: preferences, onboarding state, custom quick-link names/URLs/icons, and recent destination labels/origins.
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
6. Add and edit a quick link, then open Settings → Privacy to clear recent destination metadata.

No paid service, test account, external hardware, or special environment is required.

## Asset manifest

- `assets/nova-store-icon-128.png` — 128×128 PNG
- `assets/nova-screenshot-01-light.png` — 1280×800 PNG
- `assets/nova-screenshot-02-suggestions.png` — 1280×800 PNG
- `assets/nova-screenshot-03-command-dark.png` — 1280×800 PNG
- `assets/nova-screenshot-04-settings.png` — 1280×800 PNG
- `assets/nova-screenshot-05-focus.png` — 1280×800 PNG
- `assets/nova-promo-small-440x280.png` — required small promo tile
- `assets/nova-promo-marquee-1400x560.png` — optional marquee tile
