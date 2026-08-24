# Server Pulse setup / 服务器状态小白说明

## English

Server Pulse gives a small live health readout in your new tab. After you approve a configured endpoint, it checks while the tab is visible every 30 seconds by default; choose 1 minute, 5 minutes, or off in **Settings → Status**. It is not a server-control panel: NOVA never asks for, stores, or uses an Alibaba Cloud account, AccessKey, SSH password, 宝塔 login, or database password.

### Connect an Alibaba Cloud price project

1. Open the price project in a normal browser tab. Use a public page that loads without a login prompt.
2. If the project already has a health URL such as `https://price.example.com/health`, copy that. Otherwise, use its public home page, such as `https://price.example.com/`.
3. Open NOVA → Settings → **Status** → **Add server**.
4. Choose **Alibaba Cloud**, name it something obvious such as `Alibaba Cloud · Pricing`, and paste the copied URL into **Server health URL**.
5. Click **Connect & verify**. When Chrome asks, approve access for that exact site.
6. Optional: add up to three named checks, for example `Website · 443` using the same public health URL.

Examples:

| What you have | What to enter |
| --- | --- |
| A domain name | `https://price.example.com/health` |
| A public IP and a web app on port 3000 | `http://47.xxx.xxx.xxx:3000/health` |
| No health route yet | `https://price.example.com/` |

### If it says Offline

- Paste the same URL into a normal browser tab first. It must open without a login prompt.
- Prefer HTTPS and a domain name. A public IP is supported only if its web port is reachable from your browser.
- Open the app's firewall/security-group rule for the web port only when you actually intend the page to be public. Do not open SSH (22), database ports, or management panels for NOVA.
- Server Pulse checks HTTP/HTTPS responses. It cannot perform raw TCP checks for SSH, private-VPC addresses, databases, AccessKeys, or passwords.

## 简体中文

System Pulse 是新标签页里的小型实时健康提示。端点首次授权后，只要新标签页可见，默认每 30 秒检测一次；可在 **设置 → 运行状态** 改为每 1 分钟、5 分钟或关闭。它不是服务器控制面板。NOVA 不会要求、保存或使用阿里云账号、AccessKey、SSH 密码、宝塔登录信息或数据库密码。

### 把阿里云上的价格项目接进来

1. 先用普通浏览器标签页打开你的价格项目，找一个不需要登录就能访问的公开页面。
2. 如果项目已有健康检查地址，例如 `https://price.example.com/health`，复制它；没有就先用项目首页，例如 `https://price.example.com/`。
3. 打开 NOVA → **设置** → **运行状态** → **添加服务器**。
4. 选择 **阿里云**，名称写成容易看懂的 `阿里云 · 价格项目`，再把复制的网址粘进 **服务器健康地址**。
5. 点击 **连接并验证**；Chrome 弹出权限请求时，只允许这个网站即可。
6. 可选：再添加最多 3 项命名检测，例如 `网站 · 443`，继续填写同一个公开健康地址。

可以照着填：

| 你现在有什么 | 填什么 |
| --- | --- |
| 域名 | `https://price.example.com/health` |
| 公网 IP，网页项目跑在 3000 端口 | `http://47.xxx.xxx.xxx:3000/health` |
| 暂时没有健康检查接口 | `https://price.example.com/` |

### 如果显示“离线”

- 先把同一个网址粘进普通浏览器标签页，它必须不登录就能打开。
- 优先使用 HTTPS 和域名。只有公网 IP 时，网页端口必须能从你的浏览器访问。
- 只有在你本来就希望网页公开时，才为网页端口开放安全组/防火墙。不要为了 NOVA 开 SSH（22）、数据库端口或管理面板。
- System Pulse 检查的是 HTTP/HTTPS 响应，不能做 SSH、内网 VPC、数据库、AccessKey 或密码的原始 TCP 检测。
