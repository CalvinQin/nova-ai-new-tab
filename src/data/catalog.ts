import type {
  AiProviderId,
  Destination,
  QuickLink,
  SearchEngineId,
} from '../types';

export const MAX_QUICK_LINKS = 12;

export const aiProviderIds: AiProviderId[] = [
  'chatgpt', 'claude', 'gemini', 'perplexity', 'grok', 'deepseek',
  'doubao', 'kimi', 'qwen', 'yuanbao',
];

export const searchEngineIds: SearchEngineId[] = [
  'google', 'baidu', 'bing', 'duckduckgo', 'brave', 'youtube', 'github', 'reddit',
  'bilibili', 'zhihu', 'xiaohongshu', 'taobao',
];

export const aiProviders: Record<AiProviderId, Destination> = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    homeUrl: 'https://chatgpt.com/',
    queryTemplate: 'https://chatgpt.com/?q={query}',
    icon: 'chatgpt',
    brandColor: '#74aa9c',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    homeUrl: 'https://claude.ai/new',
    icon: 'claude',
    brandColor: '#d97757',
    note: 'Prompt is copied before opening Claude.',
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    homeUrl: 'https://gemini.google.com/app',
    icon: 'gemini',
    brandColor: '#8e9cf4',
    note: 'Prompt is copied before opening Gemini.',
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    homeUrl: 'https://www.perplexity.ai/',
    queryTemplate: 'https://www.perplexity.ai/search?q={query}',
    icon: 'perplexity',
    brandColor: '#20b8cd',
  },
  grok: {
    id: 'grok',
    name: 'Grok',
    homeUrl: 'https://grok.com/',
    icon: 'grok',
    brandColor: '#a6a6a6',
    note: 'Prompt is copied before opening Grok.',
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    homeUrl: 'https://chat.deepseek.com/',
    icon: 'deepseek',
    brandColor: '#4d6bfe',
    note: 'Prompt is copied before opening DeepSeek.',
  },
  doubao: {
    id: 'doubao',
    name: '豆包',
    homeUrl: 'https://www.doubao.com/chat/',
    icon: 'doubao',
    brandColor: '#4d71ff',
    note: 'Prompt is copied before opening 豆包.',
    region: 'china',
  },
  kimi: {
    id: 'kimi',
    name: 'Kimi',
    homeUrl: 'https://www.kimi.com/',
    icon: 'kimi',
    brandColor: '#2265de',
    note: 'Prompt is copied before opening Kimi.',
    region: 'china',
  },
  qwen: {
    id: 'qwen',
    name: '通义千问',
    shortName: '千问',
    homeUrl: 'https://chat.qwen.ai/',
    icon: 'qwen',
    brandColor: '#5d66f6',
    note: 'Prompt is copied before opening 通义千问.',
    region: 'china',
  },
  yuanbao: {
    id: 'yuanbao',
    name: '腾讯元宝',
    shortName: '元宝',
    homeUrl: 'https://yuanbao.tencent.com/',
    icon: 'yuanbao',
    brandColor: '#2f91f8',
    note: 'Prompt is copied before opening 腾讯元宝.',
    region: 'china',
  },
};

export const searchEngines: Record<SearchEngineId, Destination> = {
  google: {
    id: 'google',
    name: 'Google',
    homeUrl: 'https://www.google.com/',
    queryTemplate: 'https://www.google.com/search?q={query}',
    icon: 'google',
    brandColor: '#4285f4',
  },
  baidu: {
    id: 'baidu',
    name: '百度',
    homeUrl: 'https://www.baidu.com/',
    queryTemplate: 'https://www.baidu.com/s?wd={query}',
    icon: 'baidu',
    brandColor: '#2932e1',
  },
  bing: {
    id: 'bing',
    name: 'Bing',
    homeUrl: 'https://www.bing.com/',
    queryTemplate: 'https://www.bing.com/search?q={query}',
    icon: 'bing',
    brandColor: '#258ffa',
  },
  duckduckgo: {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    shortName: 'DuckDuckGo',
    homeUrl: 'https://duckduckgo.com/',
    queryTemplate: 'https://duckduckgo.com/?q={query}',
    icon: 'duckduckgo',
    brandColor: '#de5833',
  },
  brave: {
    id: 'brave',
    name: 'Brave Search',
    shortName: 'Brave',
    homeUrl: 'https://search.brave.com/',
    queryTemplate: 'https://search.brave.com/search?q={query}',
    icon: 'brave',
    brandColor: '#fb542b',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    homeUrl: 'https://www.youtube.com/',
    queryTemplate: 'https://www.youtube.com/results?search_query={query}',
    icon: 'youtube',
    brandColor: '#ff0033',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    homeUrl: 'https://github.com/',
    queryTemplate: 'https://github.com/search?q={query}',
    icon: 'github',
    brandColor: '#d2d7df',
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    homeUrl: 'https://www.reddit.com/',
    queryTemplate: 'https://www.reddit.com/search/?q={query}',
    icon: 'reddit',
    brandColor: '#ff4500',
  },
  bilibili: {
    id: 'bilibili',
    name: 'Bilibili',
    homeUrl: 'https://www.bilibili.com/',
    queryTemplate: 'https://search.bilibili.com/all?keyword={query}',
    icon: 'bilibili',
    brandColor: '#00aeec',
  },
  zhihu: {
    id: 'zhihu',
    name: '知乎',
    homeUrl: 'https://www.zhihu.com/',
    queryTemplate: 'https://www.zhihu.com/search?type=content&q={query}',
    icon: 'zhihu',
    brandColor: '#1772f6',
  },
  xiaohongshu: {
    id: 'xiaohongshu',
    name: '小红书',
    homeUrl: 'https://www.xiaohongshu.com/',
    queryTemplate: 'https://www.xiaohongshu.com/search_result?keyword={query}',
    icon: 'xiaohongshu',
    brandColor: '#ff2442',
  },
  taobao: {
    id: 'taobao',
    name: '淘宝',
    homeUrl: 'https://www.taobao.com/',
    queryTemplate: 'https://s.taobao.com/search?q={query}',
    icon: 'taobao',
    brandColor: '#ff5000',
  },
};

export const defaultQuickLinks: QuickLink[] = [
  {
    id: 'tradeflow-default',
    name: 'TradeFlow',
    url: 'https://www.tradeflowai.cn/',
    icon: 'tradeflow',
    brandColor: '#4aa88c',
  },
  {
    id: 'alibaba-default',
    name: 'Alibaba Seller',
    url: 'https://seller.alibaba.com/',
    icon: 'alibaba',
    brandColor: '#ff6a00',
  },
  {
    id: 'github-default',
    name: 'GitHub',
    url: 'https://github.com/',
    icon: 'github',
    brandColor: '#d2d7df',
  },
  {
    id: 'chatgpt-default',
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
    icon: 'chatgpt',
    brandColor: '#74aa9c',
  },
  {
    id: 'gmail-default',
    name: 'Gmail',
    url: 'https://mail.google.com/',
    icon: 'gmail',
    brandColor: '#ea4335',
  },
  {
    id: 'notion-default',
    name: 'Notion',
    url: 'https://www.notion.so/',
    icon: 'notion',
    brandColor: '#d7d7d2',
  },
  {
    id: 'drive-default',
    name: 'Drive',
    url: 'https://drive.google.com/',
    icon: 'drive',
    brandColor: '#0f9d58',
  },
  {
    id: 'youtube-default',
    name: 'YouTube',
    url: 'https://www.youtube.com/',
    icon: 'youtube',
    brandColor: '#ff0033',
  },
  {
    id: 'figma-default',
    name: 'Figma',
    url: 'https://www.figma.com/',
    icon: 'figma',
    brandColor: '#a259ff',
  },
];

export function getDestination(mode: 'ai' | 'search', id: string): Destination | undefined {
  return mode === 'ai'
    ? aiProviders[id as AiProviderId]
    : searchEngines[id as SearchEngineId];
}
