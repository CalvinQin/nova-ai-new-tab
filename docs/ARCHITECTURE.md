# NOVA architecture / 架构说明

This document maps the product information architecture to the implementation. It is intentionally bilingual so contributors can preserve the original Chinese product brief while working in the English-first codebase.

本文把产品信息架构映射到当前实现。文档采用中英双语，方便贡献者在英文优先的代码库中继续遵守原始中文产品要求。

## Product information architecture / 产品信息架构

NOVA has one primary loop:

```text
Input → classify → suggest → choose → execute
输入 → 识别 → 建议 → 选择 → 执行
```

The interface is deliberately split into three visual levels:

1. **Primary:** greeting, AI/Search mode, provider picker, and Universal Command Bar.
2. **Secondary:** context chips, quick links, and privacy-safe recent destinations.
3. **Utility:** clock, Focus Mode, settings, onboarding, shortcut editor, command palette, and toast feedback.

首页只让主命令循环占据视觉中心；辅助入口和设置能力保持低权重。Focus Mode 会移除问候语、时钟、快捷方式与最近目标，让命令栏成为唯一主要内容。

## Runtime pipeline / 运行流程

```text
CommandBar
  ├─ slash command? ───────────────┐
  ├─ safe URL / localhost / IPv4? ├─ resolveInput()
  ├─ arithmetic expression? ──────┤
  └─ current AI or Search target? ┘
                                      ↓
                         ResolvedAction union
                 navigate | calculate | local | switch
                                      ↓
                                  App.tsx
                 copy-and-open | navigate | update UI
```

`src/lib/command.ts` is the only input-classification layer. It never calls an AI API and never injects scripts into destination pages. Stable query URLs receive encoded input directly; other AI providers use a clipboard handoff before opening the official site.

`src/lib/command.ts` 是唯一输入分类层，不调用 AI API，也不向目标网站注入脚本。有稳定查询地址的平台直接接收编码后的输入；其他 AI 平台使用“复制提示词并打开官网”的轻量交接。

## Component boundaries / 组件边界

```text
App
├─ TopBar
├─ CommandBar
│  ├─ AI/Search mode switch
│  ├─ DestinationPicker
│  ├─ universal input
│  ├─ SuggestionPanel
│  └─ ContextChips
├─ QuickLinks
├─ RecentStrip
├─ OnboardingDialog
├─ SettingsDialog
├─ ShortcutDialog
├─ CommandPaletteDialog
└─ Toast
```

- `App.tsx` owns orchestration, navigation, overlays, global shortcuts, and ambient pointer motion.
- `CommandBar.tsx` owns the keyboard-first input state and provider/search pickers.
- `QuickLinks.tsx` owns pointer and keyboard drag-and-drop; the store enforces the 12-link invariant.
- Dialog components own focus entry, Escape behavior, inline validation, and their local draft state.
- `src/data/catalog.ts` is the authoritative AI, search, and default-shortcut catalog.
- `src/store/useNovaStore.ts` is the single persisted state boundary.

## State and privacy / 状态与隐私

Persisted with `chrome.storage.local`:

- onboarding completion;
- appearance and visibility preferences;
- selected mode, AI provider, and search engine;
- shortcut names, URLs, and icon URLs;
- optional Server Pulse display configuration, endpoint URLs, health labels, latency, and check times;
- recent destination labels and safe destination URLs.

Never persisted by NOVA:

- AI prompts;
- search queries;
- page contents;
- credentials, cookies, or browsing history.

The extension has no backend, analytics, background worker, or remotely executed code. Server Pulse declares optional HTTP/HTTPS host access, but requests exact configured origins only after the user presses **Connect & verify**. Once approved, it refreshes direct browser `GET` probes while the new-tab page is visible (30 seconds by default, configurable to 1 minute, 5 minutes, or off). NOVA never handles credentials or proxies the request. The storage adapter falls back to browser `localStorage` only for source previews and automated tests.

## Extension points / 扩展点

The first release intentionally ships no general-purpose widgets or bookmark access. `QuickLinks` and `RecentStrip` are independent, settings-gated modules inside `secondary-content`; future Weather, Calendar, Todo, Notes, Bookmark, or GitHub Activity modules should be mounted at the same boundary and remain independently dismissible.

第一版刻意不加入通用 Widget，也不申请书签权限。`QuickLinks` 与 `RecentStrip` 已作为 `secondary-content` 中独立、可关闭的模块；未来天气、日历、待办、笔记、书签或 GitHub Activity 应沿用同一挂载边界，并保持独立关闭能力。

Bookmark search remains deferred because the product brief marks it optional and enabling it would require an additional Chrome permission. Any future implementation must add the permission deliberately, document the reason, and keep bookmark data local.

书签搜索在需求中属于可选项，且会增加 Chrome 权限，因此当前延后。未来实现时必须显式增加并解释权限，且书签数据仍只能在本机处理。

## Release invariants / 发布不变量

- `package.json` and `public/manifest.json` versions must match.
- `manifest.json` must remain at the root of the release ZIP.
- `storage` is the only default extension permission. Optional host access is permitted only for the user-initiated Server Pulse flow and must remain documented in the privacy policy and Web Store listing.
- English is the default manifest locale; Simplified Chinese is provided through `_locales/zh_CN`.
- The release ZIP must pass `unzip -t`, and its downloaded GitHub copy must match the local SHA-256.
- Store screenshots must show the actual packaged extension, not a static mockup.

Run the complete local gate with:

```bash
npm run check
npm audit --audit-level=high
npm run store:assets
```
