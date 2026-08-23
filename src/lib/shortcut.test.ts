import { describe, expect, it } from 'vitest';
import { normalizeShortcutUrl, shortcutMeta } from './shortcut';

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
});
