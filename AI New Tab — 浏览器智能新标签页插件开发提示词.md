# AI New Tab — 浏览器智能新标签页插件开发提示词

请帮我设计并开发一个 **极其现代、高级、具有 AI Native 感的新标签页浏览器插件**。

它不是传统的 Chrome 导航页，也不要做成常见的“搜索框 + 一堆网站 Logo”的廉价导航站。

整体体验应该更接近：

- Raycast
- Linear
- Arc Browser
- Attio
- Perplexity
- ChatGPT
- Vercel
- macOS Spotlight

关键词：

**Minimal / AI Native / Premium / Calm / Futuristic / Spatial / Keyboard First**

最终效果需要像一个真正由一线互联网公司设计的 AI 浏览器首页。

---

# 一、核心定位

每次用户打开浏览器新标签页时，都进入这个页面。

整个页面的视觉核心只有一个东西：

> **Universal Command Bar**

用户可以直接：

- 问 AI
- Google 搜索
- Bing 搜索
- Perplexity 搜索
- YouTube 搜索
- GitHub 搜索
- 小红书搜索
- 知乎搜索
- 淘宝搜索
- Bilibili 搜索
- 打开网站
- 执行快捷命令

不要在插件内部真正调用 AI API。

第一版核心逻辑应该是：

**输入内容 → 根据当前选择的目标 → 自动拼接 URL → 跳转到对应网站**

这样插件不需要 API Key，也不需要维护 AI Backend。

---

# 二、主输入框

页面中央偏上的位置放置一个非常大的 Universal Input / Command Bar。

不要设计成普通 Google 搜索框。

应该类似：

**Ask anything, search anything...**

输入框需要有高级的空间感：

- 大圆角
- 极细边框
- 半透明
- backdrop blur
- 很弱的 shadow
- hover 微光
- focus 状态产生细腻 glow
- 输入时有非常轻微的 scale / blur / shadow 动画
- 禁止夸张霓虹灯
- 禁止廉价 AI 蓝紫渐变

输入框左边根据当前模式显示对应 Icon。

例如：

AI Mode：

`✦ Ask AI`

Search：

`⌕ Search`

右边可以显示：

`⌘ K`

或者当前搜索目标。

---

# 三、AI / Search Mode 切换

输入框上方或者输入框内部设计一个极其简洁的 Mode Switch：

**AI     Search**

支持：

`Tab`

键直接切换。

例如：

AI 模式：

> ✦ Ask AI

Search 模式：

> ⌕ Search

切换时不要直接硬切。

使用：

- animated pill
- spring animation
- opacity
- blur
- translate

做出非常顺滑的状态切换。

---

# 四、AI Provider

AI 模式下支持选择 AI：

- ChatGPT
- Claude
- Gemini
- Perplexity
- Grok
- DeepSeek

默认可以设置：

ChatGPT

用户输入：

`帮我写一封开发信`

然后 Enter。

自动跳转：

ChatGPT 对应网站并携带 Prompt。

如果某个平台支持 URL Query，则直接 Query 跳转。

如果目标网站不支持直接通过 URL 带 Prompt，则采取最合理的兼容方案：

- 打开目标页面
- 可以考虑复制 Prompt 到剪贴板
- 显示轻量 Toast：
  
  `Prompt copied — paste to continue`

但不要为了实现这个功能引入复杂、不稳定或者违规的 DOM Injection。

Provider 选择器设计成高级 Popover。

不要传统 `<select>`。

显示：

AI Logo  
AI Name

并支持键盘上下选择。

---

# 五、Search Engine

Search 模式支持：

- Google
- Bing
- DuckDuckGo
- Brave Search
- YouTube
- GitHub
- Reddit
- Bilibili
- 知乎
- 小红书
- 淘宝

例如：

输入：

`MacBook Pro M5 review`

Google 模式：

直接：

Google Search

YouTube：

直接：

YouTube Search

GitHub：

直接：

GitHub Search

搜索引擎同样使用精致的 Popover Picker。

---

# 六、一个非常重要的交互：Tab

整个插件要非常 Keyboard First。

例如：

直接输入：

`AI browser`

按：

`Tab`

AI → Search

再次：

`Tab`

Search → AI

可以考虑：

`⌘ + K`

直接 Focus 输入框。

`↑ ↓`

切换建议。

`Enter`

执行。

`Esc`

关闭菜单。

不要要求用户一直使用鼠标。

---

# 七、快捷 Command

给这个输入框加入 Command Bar 思维。

用户可以输入：

`/`

弹出 Commands。

例如：

/google

/youtube

/github

/chatgpt

/claude

/gemini

/reddit

/settings

/theme

/apps

例如：

输入：

`/youtube iPhone 18`

Enter

直接搜索 YouTube。

输入：

`/claude 帮我检查这个 React 代码`

直接进入 Claude。

这部分交互参考 Raycast。

---

# 八、网站快捷入口

输入框下面设计网站快捷入口。

但是千万不要做成传统浏览器：

一排巨大的彩色 Logo。

应该设计成非常干净的 App Dock / Quick Links。

例如：

GitHub  
YouTube  
Gmail  
Notion  
Figma  
ChatGPT  
Google Drive

每个快捷入口：

- 圆角 Icon Container
- 网站真实 favicon / logo
- Name
- hover animation
- hover tooltip
- 点击打开网站

Hover 时：

轻微向上移动：

`translateY(-2px)`

Icon 微微放大。

背景轻微变亮。

---

# 九、自定义快捷网站

用户必须可以自己添加网站。

点击：

`+`

打开一个非常漂亮的小 Modal。

输入：

Name

URL

Icon

Icon 优先自动获取网站 favicon。

例如用户输入：

`https://github.com`

自动：

Name → GitHub

Icon → GitHub favicon

用户可以修改名称和 Icon。

支持：

- 添加
- 删除
- 编辑
- 拖拽排序

使用 Local Storage 或 Chrome Storage 保存。

---

# 十、拖拽排序

Quick Links 支持 Drag & Drop。

拖拽过程中：

- 当前 Icon lifted
- shadow 增强
- scale 1.05
- 其他 Icon 自动让位
- spring animation

不要出现生硬 DOM 位移。

建议使用：

Framer Motion

或者：

dnd-kit

实现。

---

# 十一、最近使用

快捷入口下面可以有非常轻量的：

**Recent**

但默认不要占据太大空间。

记录最近通过这个插件访问的：

AI

Search

Website

例如：

ChatGPT  
GitHub  
YouTube

不要记录用户输入的敏感 Prompt。

Privacy First。

---

# 十二、Smart Suggestions

用户输入时下面弹出 Suggestion Panel。

例如输入：

`react`

显示：

✦ Ask ChatGPT about "react"

⌕ Search Google for "react"

▶ Search YouTube for "react"

◉ Search GitHub for "react"

可以通过：

↑ ↓

选择。

Enter 执行。

做成类似 Spotlight / Raycast 的感觉。

---

# 十三、Context Chips

输入框下方可以偶尔显示非常轻量的推荐：

Ask AI

Search Web

YouTube

GitHub

这些不是一直很显眼。

只作为辅助。

---

# 十四、Clock

页面可以显示时间，但不要设计成传统导航网站那种：

# 23:42

巨大时钟。

采用非常克制的设计。

例如右上角：

`23:42`

下面小字：

`Sunday, Aug 23`

甚至可以设置：

显示 / 隐藏。

---

# 十五、动态背景

背景非常重要。

不要：

- 星空
- AI机器人
- Cyberpunk
- 紫色渐变
- 蓝紫 Neon
- 网格满屏
- 廉价粒子动画

希望是一种：

**Ambient AI Background**

例如纯净的深色：

`#08090A`

或者柔和暖白。

背景存在非常缓慢变化的：

- radial gradient
- blurred light
- noise texture
- very subtle grain
- mesh gradient

鼠标移动时可以有非常微弱的视差。

但 FPS 必须稳定。

不要影响输入。

---

# 十六、主题

至少支持：

Light

Dark

System

Dark 推荐：

接近：

Linear / Vercel / Arc

不要纯黑：

`#000`

可以使用：

`#090909`

`#0B0C0E`

`#101113`

Light：

不要纯白。

使用稍微暖一点：

`#F7F7F5`

---

# 十七、Accent

允许用户选择极少量 Accent：

Neutral

Blue

Purple

Green

Orange

但是颜色只用于：

- selected state
- cursor
- tiny glow
- icon accent

不能把整个网页染成 AI 蓝紫色。

默认：

Neutral。

---

# 十八、Greeting

可以加入很克制的 Greeting。

例如：

Good evening.

或者：

What are we looking for?

或者：

Where to?

每天/每个时间段可以略有变化。

但是不要：

“Hello Calvin 👋, how can I assist you today?”

这种典型 AI 模板感。

---

# 十九、Focus Mode

增加一个非常值得做的模式：

**Focus Mode**

点击右上角按钮后：

隐藏：

- Clock
- Shortcuts
- Recent
- Widget

页面只留下：

Universal Command Bar。

变成一个极度纯净的 AI / Search Launcher。

---

# 二十、可扩展 Widget

架构层面预留 Widgets，但第一版不要塞太多东西。

未来可以加入：

- Weather
- Calendar
- Todo
- Notes
- Clipboard
- Bookmarks
- Recently visited
- GitHub Activity
- AI shortcuts

Widget 必须模块化。

用户可以关闭。

页面默认应该保持非常干净。

---

# 二十一、Bookmarks

可以考虑读取 Chrome Bookmarks。

用户点击：

Bookmarks

出现 Spotlight 风格搜索。

例如：

输入：

`ali`

自动检索 Bookmark：

Alibaba

Alibaba Seller

Alibaba Analytics

支持模糊匹配。

---

# 二十二、URL 自动识别

Command Bar 应该判断输入类型。

例如：

`github.com`

→ 直接打开 GitHub

`localhost:3000`

→ 直接访问 localhost

`192.168.1.1`

→ 直接访问

普通自然语言：

→ 根据当前 AI / Search 模式执行。

---

# 二十三、Calculator

Command Bar 可以识别简单计算：

`125 * 8`

直接在 Suggestion 中显示：

`1000`

不需要跳转网站。

未来可以扩展：

Currency

Unit Conversion

但第一版只需要简单 Calculator。

---

# 二十四、UI Layout

建议页面结构：

```text
┌────────────────────────────────────────────────────┐
│                                          23:42  ⚙ │
│                                                    │
│                                                    │
│                     Good evening.                  │
│                                                    │
│             ┌──────────────────────────┐           │
│             │     AI       Search      │           │
│             └──────────────────────────┘           │
│                                                    │
│       ┌──────────────────────────────────────┐     │
│       │ ✦  Ask anything...            ⌘ K   │     │
│       └──────────────────────────────────────┘     │
│                                                    │
│          ○      ○      ○      ○      ○     +      │
│        GitHub  GPT   YouTube Gmail  Notion        │
│                                                    │
│                    Recent                          │
│                                                    │
└────────────────────────────────────────────────────┘
```

但是实际实现不能照搬这个 wireframe。

需要进行专业 UI 设计。

---

# 二十五、动画语言

整个项目需要建立统一 Motion System。

建议：

Framer Motion。

动画原则：

Fast

Soft

Precise

Subtle

例如：

Hover：

100–180ms

Popover：

150–220ms

Modal：

200–300ms

页面初次进入：

300–500ms

使用：

spring

easeOut

opacity

translateY

blur

scale

避免大量 bounce。

AI / Search 切换可以做成：

滑动 indicator + blur transition。

快捷入口加载：

非常轻微 stagger。

---

# 二十六、设计细节

重点处理：

Spacing

Typography

Border opacity

Blur

Shadows

Hover states

Focus states

Empty states

Micro interactions

Cursor

Keyboard Navigation

不要只实现“功能能跑”。

我要的是：

**真正可以拿去作为 Product Hunt 产品发布的完成度。**

---

# 二十七、字体

优先：

Inter

Geist

SF Pro 系统字体

建议：

```css
font-family:
Inter,
Geist,
-apple-system,
BlinkMacSystemFont,
"SF Pro Display",
sans-serif;
```

避免：

Poppins

Montserrat

以及各种典型模板字体。

---

# 二十八、Icon

统一使用专业 Icon Library。

建议：

Lucide

Phosphor Icons

Tabler Icons

不要：

Emoji

不要混用不同风格 SVG。

AI / Website 品牌 Logo 可以使用真实品牌 SVG / favicon。

---

# 二十九、技术栈

推荐：

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- dnd-kit
- Lucide Icons

Browser Extension：

Chrome Extension

Manifest V3

同时尽可能兼容：

- Chrome
- Edge
- Arc
- Brave

项目架构必须支持未来 Firefox。

---

# 三十、Chrome Extension

插件应覆盖：

```json
"chrome_url_overrides": {
  "newtab": "index.html"
}
```

注意：

不要申请不需要的 Chrome Permissions。

Privacy First。

用户的数据：

- shortcuts
- preferences
- theme
- provider
- search engine

优先保存在：

chrome.storage.local

未来可以增加：

chrome.storage.sync

实现跨设备同步。

---

# 三十一、Settings

Settings 不要跳到一个丑陋后台。

使用漂亮的：

Side Panel / Modal。

分类：

General

AI

Search

Shortcuts

Appearance

Privacy

Keyboard

About

支持设置：

Default AI

Default Search Engine

Default Mode

Theme

Accent

Show Clock

Show Greeting

Show Recent

Show Shortcuts

Focus Mode

Animations

---

# 三十二、首次启动 Onboarding

第一次打开插件时不要弹复杂教程。

只需要非常精致的 2–3 步：

### 1

Welcome.

Choose your default:

AI / Search

### 2

Choose AI:

ChatGPT

Claude

Gemini

Perplexity

### 3

Choose search:

Google

Bing

DuckDuckGo

完成：

You're ready.

然后进入主页。

---

# 三十三、Command Palette

除了主输入框之外：

`⌘ + K`

永远 Focus Command Bar。

也可以加入：

`⌘ + Shift + P`

打开真正 Command Palette。

例如：

Change theme

Add shortcut

Switch AI

Switch search engine

Open settings

Toggle Focus Mode

Keyboard shortcuts

这样整个产品更接近一个：

**Browser OS Launcher**

而不是单纯新标签页。

---

# 三十四、产品命名方向

代码内部先不要绑定正式品牌。

可以暂时叫：

**NOVA**

或者：

**Orbit**

或者：

**Zero**

或者：

**Mono**

或者：

**Command**

视觉上只需要一个很小的 Symbol。

不要巨大 Logo。

---

# 三十五、非常重要：避免 AI 味

禁止出现：

- 满屏蓝紫渐变
- 发光 AI 球
- Robot
- 星星 ✨ 到处都是
- Glassmorphism 滥用
- 所有东西都是卡片
- 巨大 Hero Title
- "Unlock the power of AI"
- 过多渐变文字
- 彩色 border
- Neon glow
- SaaS Landing Page 风格

高级感应该来自：

Typography

Spacing

Motion

Hierarchy

Interaction

Texture

Detail

而不是特效堆砌。

---

# 三十六、最终目标

最终打开 Chrome 新标签页应该给人这种感觉：

> 这不是一个“浏览器插件”。

而像：

> 一个安装在浏览器里的轻量 AI Operating System。

用户打开标签页后无需思考：

**输入 → Tab → Enter**

即可完成绝大多数浏览器操作。

优先把：

**Universal Command Bar + AI/Search Switch + Quick Links + Command System**

做到极致。

不要为了功能数量牺牲首页的高级感。

第一版即使功能少，也必须做到：

**极简、极快、极顺滑、极高级。**

请先分析整个产品信息架构和组件结构，再开始实现。

实现过程中优先保证：

1. UI 视觉完成度
2. 输入体验
3. 键盘交互
4. AI/Search 切换体验
5. Motion
6. 快捷网站管理
7. 页面性能
8. 扩展性

不要先堆功能再修 UI。

从一开始就按照可以正式发布的 Production Product 标准实现。