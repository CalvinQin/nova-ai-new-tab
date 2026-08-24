# NOVA v0.2.0 — System Pulse / 系统脉冲

NOVA v0.2.0 adds a quiet, user-controlled Server Pulse to the new tab: configure up to two named servers and up to three endpoint or port checks per server. Select a visual preset for 宝塔, Cloudflare, Alibaba Cloud, DigitalOcean, Vercel, or a custom service, then check it only when you choose to.

NOVA v0.2.0 在新标签页加入克制、由用户掌控的“系统脉冲”：最多配置 2 台命名服务器、每台最多 3 项端点或端口检测。可选宝塔、Cloudflare、阿里云、DigitalOcean、Vercel 或自定义的视觉预设，并且只在你主动点击时检测。

## Privacy / 隐私

Server endpoint access is optional. NOVA requests access only to the exact origins you configure, and only after you press **Connect & verify** or **Refresh**. Checks are direct transient browser requests; credentials are neither requested nor stored, and there is no NOVA backend.

服务器端点访问是可选的。NOVA 只会在你点击“连接并检测”或“刷新”后，针对已配置的精确来源请求访问权限。检测由浏览器直接临时发起；不会要求或保存凭证，也没有 NOVA 后端。

## Stability / 稳定性

- Quick-link drag sorting now has one transform owner and a registered drag activator, removing the drift caused by competing layout transforms.
- Quick links sort on a single horizontal axis and support deterministic adjacent keyboard movement.
- Ambient and Settings motion has been reduced for a calmer, smoother experience.

## Install / 安装

1. Download `nova-ai-new-tab-v0.2.0.zip` below / 下载下方 ZIP。
2. Unzip it / 解压。
3. Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the extracted folder / 打开 `chrome://extensions`，开启开发者模式，选择“加载已解压的扩展程序”，并选中解压后的目录。
