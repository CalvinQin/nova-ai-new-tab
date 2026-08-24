# NOVA Chrome Web Store upload checklist / 上架操作清单

Chrome Web Store protects its developer dashboard from browser-extension automation. The first item must therefore be created in the dashboard. Every file and text field below is already prepared.

Chrome 应用商店会阻止浏览器扩展脚本控制开发者后台，因此首个条目必须在后台手工创建。以下文件与文字均已准备完成。

## 1. Create the item / 创建条目

1. Open `https://chrome.google.com/webstore/devconsole/`.
2. Choose **Add new item / 添加新条目**.
3. Upload `nova-ai-new-tab-v0.1.1.zip`.

The ZIP has `manifest.json` at its root, includes English and Simplified Chinese locales, and has already passed `unzip -t`.

## 2. Store listing / 商品详情

Copy the English and Simplified Chinese title, summary, and detailed description from `STORE_LISTING.md`.

Upload these assets in order:

1. `nova-store-icon-128.png`
2. `nova-screenshot-01-light.png`
3. `nova-screenshot-02-suggestions.png`
4. `nova-screenshot-03-command-dark.png`
5. `nova-screenshot-04-settings.png`
6. `nova-screenshot-05-focus.png`
7. `nova-promo-small-440x280.png`
8. `nova-promo-marquee-1400x560.png`

Use:

- Category: Productivity
- Homepage: `https://github.com/CalvinQin/nova-ai-new-tab`
- Support: `https://github.com/CalvinQin/nova-ai-new-tab/issues`
- Privacy policy: `https://github.com/CalvinQin/nova-ai-new-tab/blob/main/PRIVACY.md`

## 3. Privacy and distribution / 隐私与发布范围

Use the exact single-purpose, `storage` permission, remote-code, data-handling, and reviewer text in `STORE_LISTING.md`.

- Remote code: No
- Mature content: No
- Pricing / in-app purchases: Free / None
- Visibility: Public
- Regions: All supported regions
- NOVA backend, analytics, advertising, and account system: None

Do not mark prompts or searches as stored by NOVA. They are processed transiently only when the user directs NOVA to open a selected third-party destination.

## 4. Before submission / 提交审核前

- Confirm the uploaded package reports version `0.1.1`.
- Confirm the only extension permission is `storage`.
- Confirm all five screenshots are visible and uncropped.
- Confirm the English and Simplified Chinese listings are both saved.
- Choose automatic publishing after approval unless staged publishing is specifically preferred.
- Submit for review only after the dashboard shows no missing required field.

The final **Submit for review** action creates an external submission. Keep that final confirmation under the publisher account owner's control.
