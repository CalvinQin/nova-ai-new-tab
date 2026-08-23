# NOVA v0.1.1 — Store-ready polish / 商店上架完善版

NOVA v0.1.1 keeps the original calm, keyboard-first experience while tightening interaction invariants and preparing a fully localized Chrome Web Store submission.

NOVA v0.1.1 保持原有安静、键盘优先的体验，同时补齐交互不变量，并完成 Chrome 应用商店本地化上架准备。

## Highlights / 亮点

- English and Simplified Chinese extension metadata / 英文与简体中文扩展元数据
- Chrome Web Store copy, privacy disclosures, reviewer steps, and verified artwork / 商店文案、隐私披露、审核步骤与经过尺寸校验的视觉素材
- Five real-browser 1280×800 screenshots plus small and marquee promotional tiles / 5 张真实浏览器 1280×800 截图及两种宣传图
- Provider-picker focus restoration and complete command-palette Keyboard access / Provider 选择器焦点恢复与命令面板 Keyboard 入口
- A strict 12-link invariant across add, delete, and Undo flows / 添加、删除和撤销流程始终遵守 12 个快捷方式上限
- Version parity across package metadata, Manifest V3, the Settings About page, and the release artifact / 包元数据、Manifest、设置页与 Release 产物版本一致

## Install / 安装

1. Download `nova-ai-new-tab-v0.1.1.zip` below / 下载下方 ZIP。
2. Unzip it / 解压文件。
3. Open `chrome://extensions` and enable Developer mode / 打开扩展程序页面并开启开发者模式。
4. Choose Load unpacked and select the unzipped folder / 点击“加载已解压的扩展程序”并选择解压目录。

Verification: ESLint passed, 43 automated tests passed, production build succeeded, the release archive passed `unzip -t`, and `npm audit` reported 0 vulnerabilities.

验证结果：ESLint 通过、43 项自动化测试通过、正式构建成功、Release 压缩包通过 `unzip -t`，`npm audit` 为 0 个漏洞。
