# NOVA v0.1.3 — Stable Focus Mode / 专注模式稳定性修复

NOVA v0.1.3 makes Focus Mode visually seamless. The command bar keeps its exact layout position while the greeting, quick links, and recent strip are hidden.

NOVA v0.1.3 修复专注模式切换时命令输入框上下跳动的问题：问候语、快捷方式和最近记录会被隐藏，但继续保留布局占位，命令栏不再因页面重心重算而移动。

## Verification / 验证

- Toggle Focus Mode with the top-bar focus control or its keyboard shortcut.
- Confirm the command input remains focused and does not shift vertically.
- Confirm the surrounding content is hidden and cannot receive pointer or accessibility focus.

## Install / 安装

1. Download `nova-ai-new-tab-v0.1.3.zip` below / 下载下方 ZIP。
2. Unzip it / 解压。
3. Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the extracted folder / 打开 `chrome://extensions`，开启开发者模式，选择“加载已解压的扩展程序”，并选中解压后的目录。
