import { createContext, useContext } from 'react';
import type { Language } from './types';

type Values = Record<string, string | number>;

const messages = {
  en: {
    'language.name': 'Language', 'language.english': 'English', 'language.chinese': '简体中文',
    'top.focus.enter': 'Enter Focus Mode', 'top.focus.leave': 'Leave Focus Mode', 'top.settings': 'Open settings',
    'mode.ai': 'AI', 'mode.search': 'Search', 'picker.ai': 'Ask with', 'picker.search': 'Search with',
    'picker.aiLabel': 'AI providers', 'picker.searchLabel': 'Search engines', 'picker.copies': 'Copies prompt',
    'command.ask': 'Ask anything…', 'command.search': 'Search anything…', 'command.askWith': 'Ask {name}', 'command.searchWith': 'Search with {name}',
    'command.stage': 'Universal command bar', 'command.mode': 'Command mode', 'command.shortcuts': 'Command shortcuts',
    'chip.ai': 'Ask AI', 'chip.search': 'Search web', 'suggest.navigate': 'Navigate', 'suggest.close': 'Close',
    'section.quickLinks': 'Quick links', 'quick.add': 'Add', 'quick.addLabel': 'Add quick link', 'quick.open': 'Open {name}', 'quick.edit': 'Edit {name}', 'quick.reorder': 'Reorder {name}',
    'section.recent': 'Recent', 'recent.empty': 'Destinations appear here — never your prompts.',
    'settings.title': 'Settings', 'settings.close': 'Close settings', 'settings.general': 'General', 'settings.ai': 'AI', 'settings.search': 'Search', 'settings.shortcuts': 'Shortcuts', 'settings.appearance': 'Appearance', 'settings.privacy': 'Privacy', 'settings.keyboard': 'Keyboard', 'settings.about': 'About',
    'settings.general.desc': 'Choose what a fresh tab feels like.', 'settings.defaultMode': 'Default mode', 'settings.greeting': 'Greeting', 'settings.clock': 'Clock', 'settings.quickLinks': 'Quick links', 'settings.recents': 'Recent destinations', 'settings.focus': 'Focus Mode', 'settings.focus.desc': 'Keep only the command bar visible.', 'settings.motion': 'Motion', 'settings.motion.desc': 'Respects the system reduced-motion preference.',
    'settings.ai.title': 'AI providers', 'settings.ai.desc': 'Choose a default provider and drag to set picker order. No AI API is called.', 'settings.search.title': 'Search engines', 'settings.search.desc': 'Choose a default engine and drag to set picker order.', 'settings.drag': 'Drag to reorder {name}', 'settings.china': 'China AI',
    'settings.shortcuts.title': 'Quick links', 'settings.shortcuts.desc': 'Edit here or drag the dock to reorder.', 'settings.edit': 'Edit', 'settings.add': 'Add shortcut', 'settings.max': 'Maximum of {count} shortcuts reached',
    'settings.appearance.desc': 'A small amount of color, used with restraint.', 'settings.theme': 'Theme', 'theme.system': 'System', 'theme.light': 'Light', 'theme.dark': 'Dark', 'settings.accent': 'Accent',
    'settings.privacy.desc': 'Your launcher data stays on this device.', 'settings.privacy.heading': 'No AI backend. No prompt history.', 'settings.privacy.body': 'NOVA stores settings, quick links, and destination names in chrome.storage.local. Search text and AI prompts are never added to Recent.', 'settings.clear': 'Clear recent', 'settings.saved': '{count} saved locally',
    'settings.keyboard.desc': 'The pointer is optional.', 'key.switch': 'Switch AI and Search', 'key.focus': 'Focus command bar', 'key.palette': 'Open command palette', 'key.suggestions': 'Navigate suggestions', 'key.run': 'Run selected action', 'key.close': 'Close the current layer', 'key.slash': 'Start a slash command',
    'settings.about.desc': 'A lightweight browser OS launcher.', 'settings.about.copy': 'Built around one calm loop: input, Tab, Enter. NOVA sends you to the services you choose and stays out of the way.', 'settings.permission': 'One permission', 'settings.storage': 'Local storage only',
    'toast.ready': '{name} is ready.', 'toast.theme': 'Theme set to {theme}.', 'toast.promptCopied': 'Prompt copied — paste to continue.', 'toast.clipboard': 'Clipboard unavailable — copy your prompt before continuing.', 'toast.max': 'Maximum of {count} shortcuts reached.', 'toast.added': '{name} added.', 'toast.updated': '{name} updated.', 'toast.removed': '{name} removed.', 'toast.restore': 'Remove another shortcut before restoring {name}.', 'toast.undo': 'Undo',
    'greeting.night': 'Still awake?', 'greeting.morning': 'Good morning.', 'greeting.afternoon': 'Good afternoon.', 'greeting.evening': 'Good evening.', 'greeting.where': 'Where to?',
    'onboard.step': 'Step {step} of 3', 'onboard.welcome': 'Welcome to NOVA', 'onboard.begin.title': 'Where do you begin?', 'onboard.begin.desc': 'Choose the mode waiting for you on a fresh tab. Tab switches it instantly.', 'onboard.ask.title': 'Ask AI', 'onboard.ask.desc': 'Start with your AI provider', 'onboard.search.title': 'Search', 'onboard.search.desc': 'Start with the open web', 'onboard.ai.eyebrow': 'Default AI', 'onboard.ai.title': 'Choose your thinking space.', 'onboard.ai.desc': 'NOVA hands off your prompt without calling an AI API itself.', 'onboard.web.eyebrow': 'Default search', 'onboard.web.title': 'Choose your way into the web.', 'onboard.web.desc': 'You can switch destinations from the command bar at any time.', 'onboard.back': 'Back', 'onboard.continue': 'Continue', 'onboard.ready': "You're ready",
  },
  'zh-CN': {
    'language.name': '语言', 'language.english': 'English', 'language.chinese': '简体中文',
    'top.focus.enter': '进入专注模式', 'top.focus.leave': '退出专注模式', 'top.settings': '打开设置',
    'mode.ai': 'AI', 'mode.search': '搜索', 'picker.ai': '使用 AI', 'picker.search': '搜索方式',
    'picker.aiLabel': 'AI 平台', 'picker.searchLabel': '搜索引擎', 'picker.copies': '将复制提示词',
    'command.ask': '问点什么…', 'command.search': '搜索任何内容…', 'command.askWith': '向 {name} 提问', 'command.searchWith': '使用 {name} 搜索',
    'command.stage': '通用命令栏', 'command.mode': '命令模式', 'command.shortcuts': '命令快捷方式',
    'chip.ai': '问 AI', 'chip.search': '网页搜索', 'suggest.navigate': '选择', 'suggest.close': '关闭',
    'section.quickLinks': '快捷网站', 'quick.add': '添加', 'quick.addLabel': '添加快捷网站', 'quick.open': '打开 {name}', 'quick.edit': '编辑 {name}', 'quick.reorder': '调整 {name} 的顺序',
    'section.recent': '最近目标', 'recent.empty': '访问目标会显示在这里，绝不保存你的提示词。',
    'settings.title': '设置', 'settings.close': '关闭设置', 'settings.general': '通用', 'settings.ai': 'AI', 'settings.search': '搜索', 'settings.shortcuts': '快捷方式', 'settings.appearance': '外观', 'settings.privacy': '隐私', 'settings.keyboard': '键盘', 'settings.about': '关于',
    'settings.general.desc': '设定每一个新标签页的样子。', 'settings.defaultMode': '默认模式', 'settings.greeting': '问候语', 'settings.clock': '时钟', 'settings.quickLinks': '快捷网站', 'settings.recents': '最近目标', 'settings.focus': '专注模式', 'settings.focus.desc': '只保留命令栏。', 'settings.motion': '动画', 'settings.motion.desc': '遵循系统的减少动态效果偏好。',
    'settings.ai.title': 'AI 平台', 'settings.ai.desc': '选择默认平台，并拖拽设置选择器顺序。不调用 AI API。', 'settings.search.title': '搜索引擎', 'settings.search.desc': '选择默认引擎，并拖拽设置选择器顺序。', 'settings.drag': '拖拽调整 {name} 的顺序', 'settings.china': '中国区 AI',
    'settings.shortcuts.title': '快捷网站', 'settings.shortcuts.desc': '可在此编辑，或在主页拖拽排序。', 'settings.edit': '编辑', 'settings.add': '添加快捷网站', 'settings.max': '已达到 {count} 个快捷方式上限',
    'settings.appearance.desc': '适量使用色彩，保持克制。', 'settings.theme': '主题', 'theme.system': '跟随系统', 'theme.light': '浅色', 'theme.dark': '深色', 'settings.accent': '强调色',
    'settings.privacy.desc': '启动器数据只存储在此设备。', 'settings.privacy.heading': '没有 AI 后端，也没有提示词历史。', 'settings.privacy.body': 'NOVA 将设置、快捷网站和目标名称存储在 chrome.storage.local。搜索内容和 AI 提示词不会保存到最近记录。', 'settings.clear': '清除最近记录', 'settings.saved': '本地已保存 {count} 项',
    'settings.keyboard.desc': '鼠标不是必需的。', 'key.switch': '切换 AI 与搜索', 'key.focus': '聚焦命令栏', 'key.palette': '打开命令面板', 'key.suggestions': '浏览建议', 'key.run': '执行所选操作', 'key.close': '关闭当前层', 'key.slash': '开始斜杠命令',
    'settings.about.desc': '轻量的浏览器 OS 启动器。', 'settings.about.copy': '围绕一个安静的循环构建：输入、Tab、Enter。NOVA 只把你带到你选择的服务，并不过度打扰。', 'settings.permission': '一个权限', 'settings.storage': '仅本地存储',
    'toast.ready': '{name} 已就绪。', 'toast.theme': '主题已切换为 {theme}。', 'toast.promptCopied': '提示词已复制，粘贴即可继续。', 'toast.clipboard': '剪贴板不可用，请先复制提示词再继续。', 'toast.max': '已达到 {count} 个快捷方式上限。', 'toast.added': '已添加 {name}。', 'toast.updated': '已更新 {name}。', 'toast.removed': '已移除 {name}。', 'toast.restore': '请先移除一个快捷方式，再恢复 {name}。', 'toast.undo': '撤销',
    'greeting.night': '还没休息？', 'greeting.morning': '早上好。', 'greeting.afternoon': '下午好。', 'greeting.evening': '晚上好。', 'greeting.where': '下一步去哪里？',
    'onboard.step': '第 {step} 步，共 3 步', 'onboard.welcome': '欢迎使用 NOVA', 'onboard.begin.title': '从哪里开始？', 'onboard.begin.desc': '选择新标签页的默认模式，按 Tab 可随时切换。', 'onboard.ask.title': '问 AI', 'onboard.ask.desc': '从你选择的 AI 平台开始', 'onboard.search.title': '搜索', 'onboard.search.desc': '从开放网络开始', 'onboard.ai.eyebrow': '默认 AI', 'onboard.ai.title': '选择你的思考空间。', 'onboard.ai.desc': 'NOVA 只负责把提示词交给目标平台，不调用自己的 AI API。', 'onboard.web.eyebrow': '默认搜索', 'onboard.web.title': '选择进入网络的方式。', 'onboard.web.desc': '随时可从命令栏切换目标。', 'onboard.back': '返回', 'onboard.continue': '继续', 'onboard.ready': '开始使用',
  },
} as const;

function format(template: string, values?: Values) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values?.[key] ?? `{${key}}`));
}

interface I18nValue {
  language: Language;
  t: (key: keyof typeof messages.en, values?: Values) => string;
}

const I18nContext = createContext<I18nValue>({
  language: 'en',
  t: (key, values) => format(messages.en[key], values),
});

export function I18nProvider({ language, children }: { language: Language; children: React.ReactNode }) {
  const t: I18nValue['t'] = (key, values) => format(messages[language][key] ?? messages.en[key], values);
  return <I18nContext.Provider value={{ language, t }}>{children}</I18nContext.Provider>;
}

// This hook intentionally shares the same module as the provider so every UI surface reads one catalog.
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  return useContext(I18nContext);
}
