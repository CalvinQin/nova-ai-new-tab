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
- The extension requests only the Chrome `storage` permission and no host permissions.

Removing the extension removes its extension-local data according to the browser's normal extension lifecycle. You can clear recent destination metadata at any time from **Settings → Privacy**.

## 简体中文

NOVA 是一个本地优先的浏览器扩展。

- NOVA 仅在 `chrome.storage.local` 中保存偏好设置、快捷方式和最近访问的目标元数据。
- NOVA 的最近记录**不会**保存提示词或搜索内容。
- NOVA 不收集统计数据、遥测数据、广告标识或用户画像。
- NOVA 不运营后端服务器，也不会把数据发送到所谓的 NOVA 服务端。
- 执行搜索或 AI 动作时，浏览器会打开目标平台的官方网站，此后的数据处理遵循该平台自己的隐私政策。
- 部分 AI 平台没有稳定的提示词链接，此时 NOVA 会把文字复制到剪贴板并打开官网，由用户自行粘贴。
- 用户为快捷方式提供的网站图标可能从对应网站的 HTTPS 地址加载。
- 扩展只申请 Chrome 的 `storage` 权限，不申请任何主机权限。

卸载扩展后，本地扩展数据会按照浏览器的正常扩展生命周期处理。用户也可以随时在 **设置 → 隐私** 中清除最近访问目标。
