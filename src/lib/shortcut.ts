import { MAX_QUICK_LINKS } from '../data/catalog';
import type { BrandIconKey, QuickLink } from '../types';

const brandHosts: Array<[RegExp, BrandIconKey]> = [
  [/tradeflowai\.cn$/i, 'tradeflow'],
  [/seller\.alibaba\.com$/i, 'alibaba'],
  [/github\.com$/i, 'github'],
  [/(chatgpt\.com|openai\.com)$/i, 'chatgpt'],
  [/youtube\.com$/i, 'youtube'],
  [/mail\.google\.com$/i, 'gmail'],
  [/notion\.so$/i, 'notion'],
  [/figma\.com$/i, 'figma'],
  [/drive\.google\.com$/i, 'drive'],
  [/reddit\.com$/i, 'reddit'],
  [/bilibili\.com$/i, 'bilibili'],
  [/zhihu\.com$/i, 'zhihu'],
  [/xiaohongshu\.com$/i, 'xiaohongshu'],
  [/taobao\.com$/i, 'taobao'],
];

export function normalizeShortcutUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function shortcutMeta(input: string): {
  name: string;
  icon: BrandIconKey;
  iconUrl: string;
} | null {
  const normalized = normalizeShortcutUrl(input);
  if (!normalized) return null;
  const url = new URL(normalized);
  const icon = brandHosts.find(([matcher]) => matcher.test(url.hostname))?.[1] ?? 'website';
  const namePart = url.hostname.replace(/^www\./, '').split('.')[0];
  const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  return {
    name,
    icon,
    iconUrl: `${url.origin}/favicon.ico`,
  };
}

export function restoreShortcutAt(
  links: QuickLink[],
  link: QuickLink,
  index: number,
): QuickLink[] {
  if (links.length >= MAX_QUICK_LINKS || links.some((item) => item.id === link.id)) {
    return links;
  }

  const next = [...links];
  next.splice(Math.max(0, Math.min(index, next.length)), 0, link);
  return next;
}
