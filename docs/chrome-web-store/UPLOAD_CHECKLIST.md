# NOVA v0.3.1 Chrome Web Store resubmission / Chrome 应用商店重新提交清单

The existing item was rejected for `Yellow Argon` keyword spam. This is a metadata correction, not an appeal: upload a higher-version package and replace the listing text with the focused copy in `STORE_LISTING.md`.

当前条目因 `Yellow Argon` 关键词堆砌被拒绝。本次是元数据整改，不是申诉：上传更高版本的包，并用 `STORE_LISTING.md` 中聚焦的文案替换商品详情。

## 1. Package / 安装包

1. In the existing item, create a new draft.
2. Upload `nova-ai-new-tab-v0.3.1.zip`.
3. Confirm that the dashboard reports version `0.3.1`.

The ZIP has `manifest.json` at its root, includes English and Simplified Chinese locales, and passes `unzip -t`.

## 2. Listing content / 商品详情文案

1. Set the title to **NOVA — Command New Tab**.
2. Set the summary to **A calm, keyboard-first command bar for every new tab.**
3. Replace the entire English detailed description with the **English listing** section in `STORE_LISTING.md`.
4. If the dashboard has a Simplified Chinese listing language, replace its title, summary, and detailed description with the Chinese section in `STORE_LISTING.md`.
5. Do not paste the older text or add lists of third-party sites, brands, regional locations, repeated keywords, testimonials, or ranking claims.

## 3. Assets and privacy / 素材与隐私

- Category: Tools / 工具
- Homepage: `https://github.com/CalvinQin/nova-ai-new-tab`
- Support: `https://github.com/CalvinQin/nova-ai-new-tab/issues`
- Privacy policy: `https://github.com/CalvinQin/nova-ai-new-tab/blob/main/PRIVACY.md`
- Remote code: No
- Mature content: No
- Pricing / in-app purchases: Free / None
- Visibility: Public
- Regions: All supported regions

Use the privacy, optional-host-permission, data-handling, and reviewer-test text from `STORE_LISTING.md` exactly. The optional HTTP(S) permission is for user-configured System Pulse endpoints; `storage` remains the only default extension permission.

Required visual assets:

1. `nova-store-icon-128.png`
2. At least one of `nova-screenshot-01-light.png` through `nova-screenshot-05-focus.png`

## 4. Final human confirmation / 最终人工确认

- Confirm all old brand/site lists have been deleted from every listing language and dashboard text field.
- Confirm the uploaded package reports `0.3.1`.
- Confirm the product description matches the actual extension functionality and privacy declarations.
- Confirm at least one current screenshot is visible and uncropped.
- Save the draft and submit it for review from the publisher account.

The final **Submit for review** action is an external submission and remains under the publisher account owner's control.
