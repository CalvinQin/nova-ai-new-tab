import { describe, expect, it } from 'vitest';
import { MAX_QUICK_LINKS } from '../data/catalog';
import type { QuickLink } from '../types';
import { normalizeShortcutUrl, restoreShortcutAt, shortcutMeta } from './shortcut';

describe('shortcut URL handling', () => {
  it('normalizes user-friendly website addresses', () => {
    expect(normalizeShortcutUrl('github.com')).toBe('https://github.com/');
    expect(normalizeShortcutUrl('http://localhost:5173')).toBe('http://localhost:5173/');
  });

  it('rejects unsafe or malformed addresses', () => {
    expect(normalizeShortcutUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeShortcutUrl('not a url')).toBeNull();
  });

  it('suggests a brand and first-party favicon URL', () => {
    expect(shortcutMeta('https://github.com/openai')).toEqual({
      name: 'Github',
      icon: 'github',
      iconUrl: 'https://github.com/favicon.ico',
    });
    expect(shortcutMeta('tradeflowai.cn')?.icon).toBe('tradeflow');
    expect(shortcutMeta('https://seller.alibaba.com/')?.icon).toBe('alibaba');
  });

  it('restores within the shortcut limit without creating duplicate IDs', () => {
    const links: QuickLink[] = Array.from({ length: MAX_QUICK_LINKS }, (_, index) => ({
      id: `link-${index}`,
      name: `Link ${index}`,
      url: `https://example.com/${index}`,
      icon: 'website',
    }));
    const removed = links[3];
    const afterDelete = links.filter((link) => link.id !== removed.id);

    expect(restoreShortcutAt(afterDelete, removed, 3).map((link) => link.id)).toEqual(
      links.map((link) => link.id),
    );
    expect(restoreShortcutAt(links, removed, 3)).toBe(links);
    expect(restoreShortcutAt(afterDelete, afterDelete[0], 0)).toBe(afterDelete);
  });
});
