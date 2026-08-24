# NOVA v0.3.0 — Live System Pulse / 实时系统脉冲

NOVA v0.3.0 turns Server Pulse into live monitoring for your approved HTTP(S) health endpoints. It measures the actual response latency of each server and configured service endpoint, then refreshes automatically while the new-tab page is visible.

NOVA v0.3.0 将服务器状态面板升级为实时监控：对你已授权的 HTTP(S) 健康地址测量真实响应延迟，并在新标签页可见时自动刷新服务器和各服务端点状态。

## How it refreshes / 刷新方式

- Default: every 30 seconds / 默认每 30 秒
- Configurable: 1 minute, 5 minutes, or manual-only / 可改为每 1 分钟、5 分钟或只手动刷新
- Visible page only: no monitoring request is made while the new tab is hidden / 仅页面可见时请求
- No new default permissions: the first **Connect & verify** action still grants only the exact configured endpoint origins / 不新增默认权限，首次“连接并验证”仍只申请已配置端点的精确来源

Browser extensions cannot open raw TCP connections to SSH or database ports. For a real service/port card, provide a public HTTP(S) health URL for that service.

浏览器扩展不能直接对 SSH 或数据库端口建立原始 TCP 连接。若要显示真实服务/端口卡片，请为该服务提供公开 HTTP(S) 健康地址。

## Install / 安装

1. Download `nova-ai-new-tab-v0.3.0.zip` below / 下载下方 ZIP。
2. Unzip it / 解压。
3. Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the extracted folder / 打开 `chrome://extensions`，开启开发者模式，选择“加载已解压的扩展程序”，并选中解压后的目录。
