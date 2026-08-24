export type Mode = 'ai' | 'search';
export type Theme = 'light' | 'dark' | 'system';
export type Accent = 'neutral' | 'blue' | 'purple' | 'green' | 'orange';
export type Language = 'en' | 'zh-CN';
export type AiProviderId =
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'perplexity'
  | 'grok'
  | 'deepseek'
  | 'doubao'
  | 'kimi'
  | 'qwen'
  | 'yuanbao';
export type SearchEngineId =
  | 'google'
  | 'baidu'
  | 'bing'
  | 'duckduckgo'
  | 'brave'
  | 'youtube'
  | 'github'
  | 'reddit'
  | 'bilibili'
  | 'zhihu'
  | 'xiaohongshu'
  | 'taobao';

export type ServerProvider =
  | 'custom'
  | 'baota'
  | 'cloudflare'
  | 'alibaba-cloud'
  | 'digitalocean'
  | 'vercel';

export type HealthStatus = 'unknown' | 'checking' | 'healthy' | 'degraded' | 'offline';
export type ServerRefreshInterval = 0 | 30_000 | 60_000 | 300_000;

export type BrandIconKey =
  | AiProviderId
  | SearchEngineId
  | 'gmail'
  | 'notion'
  | 'figma'
  | 'drive'
  | 'alibaba'
  | 'tradeflow'
  | 'doubao'
  | 'kimi'
  | 'qwen'
  | 'yuanbao'
  | 'website';

export interface Destination {
  id: AiProviderId | SearchEngineId;
  name: string;
  shortName?: string;
  region?: 'global' | 'china';
  homeUrl: string;
  queryTemplate?: string;
  icon: BrandIconKey;
  brandColor: string;
  note?: string;
}

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: BrandIconKey;
  iconUrl?: string;
  brandColor?: string;
}

export interface RecentItem {
  id: string;
  targetId: string;
  label: string;
  kind: 'ai' | 'search' | 'website';
  safeUrl?: string;
  timestamp: number;
}

export interface ServerPort {
  id: string;
  name: string;
  url: string;
  status: HealthStatus;
  latency?: number;
  checkedAt?: number;
}

export interface MonitoredServer {
  id: string;
  name: string;
  provider: ServerProvider;
  healthUrl: string;
  status: HealthStatus;
  latency?: number;
  checkedAt?: number;
  ports: ServerPort[];
}

export interface ServerMonitorSettings {
  enabled: boolean;
  refreshInterval: ServerRefreshInterval;
  servers: MonitoredServer[];
}

export interface NovaSettings {
  defaultMode: Mode;
  aiProvider: AiProviderId;
  searchEngine: SearchEngineId;
  theme: Theme;
  accent: Accent;
  showClock: boolean;
  showGreeting: boolean;
  showRecent: boolean;
  showShortcuts: boolean;
  focusMode: boolean;
  animations: boolean;
  language: Language;
  aiProviderOrder: AiProviderId[];
  searchEngineOrder: SearchEngineId[];
  serverMonitor: ServerMonitorSettings;
}
