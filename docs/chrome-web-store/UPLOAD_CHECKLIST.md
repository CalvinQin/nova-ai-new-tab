# NOVA Chrome Web Store upload checklist / 上架操作清单

Chrome Web Store protects its developer dashboard from browser-extension automation. Its current v2 API only uploads packages to an existing item; this account has no preconfigured Chrome Web Store OAuth client or item ID. The first draft therefore needs to be created in the dashboard. Every file and text field below is already prepared.

Chrome 应用商店会阻止浏览器扩展脚本控制开发者后台；当前 v2 API 也只能向既有条目上传包，而该账号尚未配置 Chrome Web Store OAuth 客户端或条目 ID。因此首个草稿需要在后台手工创建。以下文件与文字均已准备完成。

## 1. Create the item / 创建条目

1. Open `https://chrome.google.com/webstore/devconsole/`.
2. Choose **Add new item / 添加新条目**.
3. Upload the current release ZIP, `nova-ai-new-tab-v0.3.0.zip`.

The ZIP has `manifest.json` at its root, includes English and Simplified Chinese locales, and has already passed `unzip -t`.

## 2. Store listing / 商品详情

On the current English listing page, paste the English **Detailed description** from `STORE_LISTING.md`; it is required even though the package already supplies the title and summary. Keep the dashboard category set to **Tools / 工具**.

Required assets:

1. `nova-store-icon-128.png`
2. At least one of `nova-screenshot-01-light.png` through `nova-screenshot-05-focus.png`

The small promo tile and marquee tile are optional. Add the remaining screenshots and these two promo assets when a richer storefront presentation is desired:

1. `nova-screenshot-02-suggestions.png`
2. `nova-screenshot-03-command-dark.png`
3. `nova-screenshot-04-settings.png`
4. `nova-screenshot-05-focus.png`
5. `nova-promo-small-440x280.png`
6. `nova-promo-marquee-1400x560.png`

The package localizes its name and summary. If the dashboard offers an additional Simplified Chinese listing language, add `zh_CN` and copy the Chinese title, summary, and detailed description from `STORE_LISTING.md`; otherwise the English detailed description is the required current field.

Use:

- Category: Tools / 工具
- Homepage: `https://github.com/CalvinQin/nova-ai-new-tab`
- Support: `https://github.com/CalvinQin/nova-ai-new-tab/issues`
- Privacy policy: `https://github.com/CalvinQin/nova-ai-new-tab/blob/main/PRIVACY.md`

## 3. Privacy and distribution / 隐私与发布范围

Use the exact single-purpose, `storage` permission, optional-host-permission, remote-code, data-handling, and reviewer text in `STORE_LISTING.md`.

- Remote code: No
- Mature content: No
- Pricing / in-app purchases: Free / None
- Visibility: Public
- Regions: All supported regions
- NOVA backend, analytics, advertising, and account system: None

Do not mark prompts or searches as stored by NOVA. They are processed transiently only when the user directs NOVA to open a selected third-party destination.

## 4. Before submission / 提交审核前

- Confirm the uploaded package reports version `0.3.0`.
- Confirm `storage` is the only default extension permission and optional HTTP/HTTPS host access is described as user-initiated Server Pulse access.
- Confirm at least one global screenshot is visible and uncropped; add up to five when desired.
- Confirm the English detailed description is saved. Confirm the Simplified Chinese listing only if that dashboard locale has been added.
- Choose automatic publishing after approval unless staged publishing is specifically preferred.
- Submit for review only after the dashboard shows no missing required field.

The final **Submit for review** action creates an external submission. Keep that final confirmation under the publisher account owner's control.
