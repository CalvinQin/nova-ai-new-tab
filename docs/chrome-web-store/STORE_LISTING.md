# NOVA Chrome Web Store listing / Chrome 应用商店商品资料

Prepared for the v0.3.1 resubmission after a `Yellow Argon` keyword-spam rejection on 2026-08-25. This file deliberately avoids lists of third-party brands, sites, locations, or repeated search terms.

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

## English listing — paste into the dashboard

### Title

NOVA — Command New Tab

### Summary

A calm, keyboard-first command bar for every new tab.

### Detailed description

NOVA replaces the browser new tab with one focused command bar. Use it to start a question, search the web, open a link, run a small calculation, or trigger a shortcut without leaving your flow.

NOVA is designed for people who prefer a quiet, keyboard-first browser. It keeps the interface simple: type once, choose an action, and continue in the destination you selected.

Key features:

- One input for questions, web searches, links, calculations, and slash commands.
- Personal quick links that you can add, edit, remove, and arrange.
- Keyboard navigation, light and dark appearance, Focus Mode, and reduced-motion support.
- An optional System Pulse that shows the health and response time of up to two user-configured servers and three HTTP(S) service checks per server.
- Local-first settings with no NOVA account, advertising, analytics, or prompt history.

NOVA opens the destination chosen by the user; it does not operate an AI backend or proxy user prompts. Server monitoring is optional: NOVA requests access only to the exact HTTP(S) endpoint origins the user enters after they select **Connect & verify**. While the new-tab page is visible, approved endpoints can be refreshed at a user-selected interval. No credentials are requested or stored.

## 简体中文商品资料 — 在后台添加中文语言后粘贴

### 标题

NOVA — 命令新标签页

### 摘要

一个安静、键盘优先的浏览器新标签命令栏。

### 详细说明

NOVA 用一个专注的命令栏替换浏览器新标签页。你可以从这里开始提问、网页搜索、打开链接、进行简单计算，或执行快捷方式，不必来回切换思路。

NOVA 为喜欢安静、键盘优先浏览体验的人设计：输入一次，选择一个动作，然后继续前往你选定的目标。

主要功能：

- 用同一个输入框处理提问、网页搜索、链接、计算和斜杠命令。
- 添加、编辑、删除并排列自己的快捷网站。
- 支持键盘导航、浅色和深色外观、专注模式与减少动态效果。
- 可选的系统脉冲：最多展示 2 台由用户配置的服务器，以及每台最多 3 项 HTTP(S) 服务检测的健康状态与响应时间。
- 设置仅在本机保存；没有 NOVA 账号、广告、统计分析或提示词历史。

NOVA 只打开用户选择的目标，不提供 AI 后端，也不代理用户提示词。服务器监控是可选功能：只有点击“连接并验证”后，NOVA 才会为用户填写的精确 HTTP(S) 端点来源请求访问权限。新标签页可见时，已授权端点可按用户选择的频率刷新；不会要求或保存任何凭证。

## Privacy practices / 隐私披露

### Single purpose

Replace the browser new tab page with a keyboard-first command surface for user-selected actions and personal shortcuts.

### `storage` permission justification

The `storage` permission saves the user's preferences, quick links, onboarding state, selected destinations, and safe recent-destination metadata locally so those choices persist across new tabs. Prompts and search queries are not added to Recent.

### Optional host permission justification

The optional `http://*/*` and `https://*/*` declarations let the user choose an HTTP(S) health endpoint for the optional System Pulse. NOVA asks for only the exact configured origins after a user selects **Connect & verify**. Once approved, it makes a direct request to that endpoint only while the new-tab page is visible and at the user-selected interval. NOVA does not read webpage content, collect credentials, or proxy requests.

### Remote code

No. All executable JavaScript and fonts are packaged with the extension. User-supplied HTTPS favicon images are displayed as images and are never executed as code.

### Data handling notes for the dashboard

- Stored locally: preferences, onboarding state, custom quick-link names/URLs/icons, selected destinations, and recent destination labels/origins.
- Stored locally when System Pulse is used: server label, provider, endpoint URLs, health label, response time, refresh interval, and check time.
- Processed transiently: text while the user chooses a destination; a direct browser `GET` to a System Pulse endpoint explicitly configured and approved by the user.
- Not collected by NOVA: there is no NOVA backend, account system, analytics, telemetry, advertising, or developer access to local extension data.
- Never sold, used for unrelated purposes, used for advertising or lending, or read by humans.

## Reviewer test instructions

1. Install the submitted package and open a new tab.
2. Complete the three-step onboarding; no account or credentials are required.
3. Enter a short question, press Tab to switch modes, and use the arrow keys to inspect suggestions.
4. Enter `125 * 8` to verify the local calculation result.
5. Enter `/settings` and `/focus` to verify local commands.
6. Add and edit a quick link, then drag it by the upper-left grip; it should settle at the chosen slot.
7. Open Settings → Status and confirm the setup form explains the optional HTTP(S) permission and **Connect & verify** flow. If desired, add a public HTTP(S) endpoint accessible to the reviewer, approve the browser prompt, and confirm the System Pulse result and latency.
8. Open Settings → Privacy to clear recent destination metadata.

No paid service, test account, external hardware, or special environment is required. The optional System Pulse check can be skipped during review.

## Asset manifest

- `assets/nova-store-icon-128.png` — 128×128 PNG
- `assets/nova-screenshot-01-light.png` — 1280×800 PNG
- `assets/nova-screenshot-02-suggestions.png` — 1280×800 PNG
- `assets/nova-screenshot-03-command-dark.png` — 1280×800 PNG
- `assets/nova-screenshot-04-settings.png` — 1280×800 PNG
- `assets/nova-screenshot-05-focus.png` — 1280×800 PNG
- `assets/nova-promo-small-440x280.png` — optional small promo tile
- `assets/nova-promo-marquee-1400x560.png` — optional marquee tile
