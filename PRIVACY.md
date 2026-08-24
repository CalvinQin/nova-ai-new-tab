# NOVA Privacy / 隐私说明

Last updated / 最后更新：2026-08-24

## English

NOVA is a local-first browser extension.

- NOVA stores preferences, quick links, and recent destination metadata in `chrome.storage.local`.
- NOVA does **not** store prompt text or search queries in its recent list.
- NOVA does **not** collect analytics, telemetry, advertising identifiers, or personal profiles.
- NOVA does **not** operate a server and does not send data to a NOVA backend.
- When you run a search or AI action, your browser opens the destination's official website. That destination's own privacy policy applies.
- Some AI destinations do not support a stable prompt URL. In that case, NOVA copies the text to your clipboard and opens the official website for you to paste it.
- Site icons supplied by users may be loaded from that site's HTTPS address.
- The extension requests Chrome `storage` by default. It declares optional HTTP/HTTPS host access solely for Server Pulse, and asks for the exact configured endpoint origins only after you select **Connect & verify** or **Refresh**.
- Server Pulse stores only its display configuration (server name, provider, and endpoint URLs) locally. It sends a transient `GET` request directly from your browser to the endpoint you chose, records only the resulting health label, latency, and check time locally, and never collects credentials or sends this information to NOVA.

Removing the extension removes its extension-local data according to the browser's normal extension lifecycle. You can clear recent destination metadata at any time from **Settings → Privacy**.

### Chrome Web Store Limited Use

NOVA's use of information received from Chrome APIs adheres to the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/user-data), including its Limited Use requirements. NOVA does not sell or transfer user data, use it for advertising or credit decisions, or allow humans to read it. Local data is used only to provide the extension's user-facing new-tab features.

## 简体中文

NOVA 是一个本地优先的浏览器扩展。

- NOVA 仅在 `chrome.storage.local` 中保存偏好设置、快捷方式和最近访问的目标元数据。
- NOVA 的最近记录**不会**保存提示词或搜索内容。
- NOVA 不收集统计数据、遥测数据、广告标识或用户画像。
- NOVA 不运营后端服务器，也不会把数据发送到所谓的 NOVA 服务端。
- 执行搜索或 AI 动作时，浏览器会打开目标平台的官方网站，此后的数据处理遵循该平台自己的隐私政策。
- 部分 AI 平台没有稳定的提示词链接，此时 NOVA 会把文字复制到剪贴板并打开官网，由用户自行粘贴。
- 用户为快捷方式提供的网站图标可能从对应网站的 HTTPS 地址加载。
- 扩展默认只申请 Chrome 的 `storage` 权限。为服务器状态面板声明了可选 HTTP/HTTPS 主机权限，但只有你点击“连接并检测”或“刷新”后，才会针对已配置端点的精确来源请求访问。
- 服务器状态面板只在本机保存展示配置（服务器名称、厂商和端点网址）；浏览器会直接向你选择的端点发起一次临时 `GET` 请求，并只在本机记录健康标签、延迟和检测时间，不收集凭证，也不会把这些信息发送给 NOVA。

卸载扩展后，本地扩展数据会按照浏览器的正常扩展生命周期处理。用户也可以随时在 **设置 → 隐私** 中清除最近访问目标。

### Chrome 应用商店有限使用声明

NOVA 对 Chrome API 所提供信息的使用遵守 [Chrome 应用商店用户数据政策](https://developer.chrome.com/docs/webstore/program-policies/user-data)，包括其中的“有限使用”要求。NOVA 不销售或转移用户数据，不将数据用于广告或信用决策，也不允许人工读取。所有本地数据只用于提供扩展面向用户的新标签页功能。
