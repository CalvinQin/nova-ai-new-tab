import { aiProviders, searchEngines } from '../data/catalog';
import type { AiProviderId, Mode, SearchEngineId } from '../types';

export type LocalCommand = 'settings' | 'theme' | 'apps' | 'focus' | 'palette';

export type ResolvedAction =
  | {
      type: 'navigate';
      url: string;
      label: string;
      targetId: string;
      kind: 'ai' | 'search' | 'website';
      copyText?: string;
      safeUrl?: string;
    }
  | { type: 'calculate'; expression: string; value: string }
  | { type: 'local'; command: LocalCommand }
  | { type: 'switch'; mode: Mode; targetId: AiProviderId | SearchEngineId; label: string };

export interface CommandDefinition {
  id: string;
  label: string;
  description: string;
  mode?: Mode;
  targetId?: AiProviderId | SearchEngineId;
  local?: LocalCommand;
}

export const commandDefinitions: CommandDefinition[] = [
  { id: 'google', label: '/google', description: 'Search with Google', mode: 'search', targetId: 'google' },
  { id: 'baidu', label: '/baidu', description: 'Search with 百度', mode: 'search', targetId: 'baidu' },
  { id: 'bing', label: '/bing', description: 'Search with Bing', mode: 'search', targetId: 'bing' },
  { id: 'duckduckgo', label: '/duckduckgo', description: 'Search privately', mode: 'search', targetId: 'duckduckgo' },
  { id: 'brave', label: '/brave', description: 'Search with Brave', mode: 'search', targetId: 'brave' },
  { id: 'youtube', label: '/youtube', description: 'Search videos', mode: 'search', targetId: 'youtube' },
  { id: 'github', label: '/github', description: 'Search code and repositories', mode: 'search', targetId: 'github' },
  { id: 'reddit', label: '/reddit', description: 'Search Reddit', mode: 'search', targetId: 'reddit' },
  { id: 'bilibili', label: '/bilibili', description: 'Search Bilibili', mode: 'search', targetId: 'bilibili' },
  { id: 'zhihu', label: '/zhihu', description: 'Search Zhihu', mode: 'search', targetId: 'zhihu' },
  { id: 'xiaohongshu', label: '/xiaohongshu', description: 'Search Xiaohongshu', mode: 'search', targetId: 'xiaohongshu' },
  { id: 'taobao', label: '/taobao', description: 'Search Taobao', mode: 'search', targetId: 'taobao' },
  { id: 'chatgpt', label: '/chatgpt', description: 'Ask ChatGPT', mode: 'ai', targetId: 'chatgpt' },
  { id: 'claude', label: '/claude', description: 'Ask Claude', mode: 'ai', targetId: 'claude' },
  { id: 'gemini', label: '/gemini', description: 'Ask Gemini', mode: 'ai', targetId: 'gemini' },
  { id: 'perplexity', label: '/perplexity', description: 'Ask Perplexity', mode: 'ai', targetId: 'perplexity' },
  { id: 'deepseek', label: '/deepseek', description: 'Ask DeepSeek', mode: 'ai', targetId: 'deepseek' },
  { id: 'grok', label: '/grok', description: 'Ask Grok', mode: 'ai', targetId: 'grok' },
  { id: 'doubao', label: '/doubao', description: 'Ask 豆包', mode: 'ai', targetId: 'doubao' },
  { id: 'kimi', label: '/kimi', description: 'Ask Kimi', mode: 'ai', targetId: 'kimi' },
  { id: 'qwen', label: '/qwen', description: 'Ask 通义千问', mode: 'ai', targetId: 'qwen' },
  { id: 'yuanbao', label: '/yuanbao', description: 'Ask 腾讯元宝', mode: 'ai', targetId: 'yuanbao' },
  { id: 'settings', label: '/settings', description: 'Open settings', local: 'settings' },
  { id: 'theme', label: '/theme', description: 'Cycle appearance', local: 'theme' },
  { id: 'apps', label: '/apps', description: 'Manage quick links', local: 'apps' },
  { id: 'focus', label: '/focus', description: 'Toggle Focus Mode', local: 'focus' },
];

function destinationAction(
  query: string,
  mode: Mode,
  targetId: AiProviderId | SearchEngineId,
): ResolvedAction {
  const destination = mode === 'ai'
    ? aiProviders[targetId as AiProviderId]
    : searchEngines[targetId as SearchEngineId];

  if (!query.trim()) {
    return { type: 'switch', mode, targetId, label: destination.name };
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const url = destination.queryTemplate
    ? destination.queryTemplate.replace('{query}', encodedQuery)
    : destination.homeUrl;

  return {
    type: 'navigate',
    url,
    label: destination.name,
    targetId: destination.id,
    kind: mode,
    copyText: destination.queryTemplate ? undefined : query.trim(),
    safeUrl: destination.homeUrl,
  };
}

export function normalizeUrl(input: string): string | null {
  const value = input.trim();
  if (!value || /\s/.test(value)) return null;

  const hasProtocol = /^https?:\/\//i.test(value);
  const candidate = hasProtocol ? value : `https://${value}`;
  const rawAuthority = value.replace(/^https?:\/\//i, '').split(/[/?#]/)[0];
  const rawHostname = rawAuthority.replace(/:\d+$/, '');
  const rawIsLocalhost = rawHostname.toLowerCase() === 'localhost';
  const rawIsIpv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(rawHostname)
    && rawHostname.split('.').every((part) => Number(part) <= 255);
  const rawIsDomain = rawHostname.includes('.') && /^[a-z0-9.-]+$/i.test(rawHostname);

  if (!rawIsLocalhost && !rawIsIpv4 && !rawIsDomain) return null;

  try {
    const parsed = new URL(candidate);
    if (rawIsLocalhost && !hasProtocol) return `http://${value}`;
    if (rawIsIpv4 && !hasProtocol) return `http://${value}`;
    return parsed.toString();
  } catch {
    return null;
  }
}

class ExpressionParser {
  private position = 0;

  constructor(private readonly source: string) {}

  parse(): number | null {
    if (!this.source || this.source.length > 128 || !/[+\-*/%()]/.test(this.source)) return null;
    const result = this.expression();
    this.skipSpaces();
    return this.position === this.source.length && Number.isFinite(result) ? result : null;
  }

  private expression(): number {
    let value = this.term();
    while (true) {
      this.skipSpaces();
      if (this.consume('+')) value += this.term();
      else if (this.consume('-')) value -= this.term();
      else break;
    }
    return value;
  }

  private term(): number {
    let value = this.factor();
    while (true) {
      this.skipSpaces();
      if (this.consume('*')) value *= this.factor();
      else if (this.consume('/')) value /= this.factor();
      else if (this.consume('%')) value %= this.factor();
      else break;
    }
    return value;
  }

  private factor(): number {
    this.skipSpaces();
    if (this.consume('+')) return this.factor();
    if (this.consume('-')) return -this.factor();
    if (this.consume('(')) {
      const value = this.expression();
      this.skipSpaces();
      if (!this.consume(')')) return Number.NaN;
      return value;
    }

    const start = this.position;
    while (/[\d.]/.test(this.source[this.position] ?? '')) this.position += 1;
    const token = this.source.slice(start, this.position);
    if (!token || (token.match(/\./g)?.length ?? 0) > 1) return Number.NaN;
    return Number(token);
  }

  private skipSpaces() {
    while (/\s/.test(this.source[this.position] ?? '')) this.position += 1;
  }

  private consume(character: string): boolean {
    if (this.source[this.position] !== character) return false;
    this.position += 1;
    return true;
  }
}

export function calculate(input: string): string | null {
  const value = new ExpressionParser(input.trim()).parse();
  if (value === null || !Number.isFinite(value)) return null;
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(10)));
}

export function resolveInput(
  input: string,
  mode: Mode,
  aiProvider: AiProviderId,
  searchEngine: SearchEngineId,
): ResolvedAction | null {
  const query = input.trim();
  if (!query) return null;

  if (query.startsWith('/')) {
    const [commandToken, ...rest] = query.split(/\s+/);
    const command = commandDefinitions.find((item) => item.label === commandToken.toLowerCase());
    if (!command) return null;
    if (command.local) return { type: 'local', command: command.local };
    if (command.mode && command.targetId) {
      return destinationAction(rest.join(' '), command.mode, command.targetId);
    }
  }

  const normalizedUrl = normalizeUrl(query);
  if (normalizedUrl) {
    const parsed = new URL(normalizedUrl);
    return {
      type: 'navigate',
      url: normalizedUrl,
      label: parsed.hostname.replace(/^www\./, ''),
      targetId: parsed.hostname,
      kind: 'website',
      safeUrl: parsed.origin,
    };
  }

  const result = calculate(query);
  if (result !== null) return { type: 'calculate', expression: query, value: result };

  return destinationAction(query, mode, mode === 'ai' ? aiProvider : searchEngine);
}

export function commandMatches(input: string): CommandDefinition[] {
  if (!input.startsWith('/')) return [];
  const token = input.split(/\s+/)[0].slice(1).toLowerCase();
  return commandDefinitions.filter((command) => command.id.startsWith(token)).slice(0, 7);
}
