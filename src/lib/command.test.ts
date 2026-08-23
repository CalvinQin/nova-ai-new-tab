import { describe, expect, it } from 'vitest';
import {
  calculate,
  commandMatches,
  normalizeUrl,
  resolveInput,
} from './command';

describe('normalizeUrl', () => {
  it.each([
    ['github.com', 'https://github.com/'],
    ['https://example.com/docs', 'https://example.com/docs'],
    ['localhost:3000', 'http://localhost:3000'],
    ['192.168.1.1', 'http://192.168.1.1'],
  ])('recognizes %s as a direct destination', (input, expected) => {
    expect(normalizeUrl(input)).toBe(expected);
  });

  it.each(['react hooks', 'not-a-host', '256.1.1.1', '1000', 'https://1000', 'javascript:alert(1)'])(
    'does not treat %s as a safe URL',
    (input) => expect(normalizeUrl(input)).toBeNull(),
  );
});

describe('calculate', () => {
  it.each([
    ['125 * 8', '1000'],
    ['2 + 3 * 4', '14'],
    ['(2 + 3) * 4', '20'],
    ['-4 + 10 / 2', '1'],
    ['10 % 4', '2'],
    ['1 / 8', '0.125'],
  ])('calculates %s without eval', (expression, expected) => {
    expect(calculate(expression)).toBe(expected);
  });

  it.each(['hello', '1 / 0', '2(3)', '1..2 + 3', 'Math.random()'])(
    'rejects %s',
    (expression) => expect(calculate(expression)).toBeNull(),
  );
});

describe('resolveInput', () => {
  it('builds the current Google search URL', () => {
    expect(resolveInput('MacBook Pro review', 'search', 'chatgpt', 'google')).toMatchObject({
      type: 'navigate',
      kind: 'search',
      targetId: 'google',
      url: 'https://www.google.com/search?q=MacBook%20Pro%20review',
    });
  });

  it('uses an AI deep link when the provider supports one', () => {
    expect(resolveInput('解释 React', 'ai', 'chatgpt', 'google')).toMatchObject({
      type: 'navigate',
      kind: 'ai',
      targetId: 'chatgpt',
      url: 'https://chatgpt.com/?q=%E8%A7%A3%E9%87%8A%20React',
      copyText: undefined,
    });
  });

  it('uses a clipboard handoff for providers without a stable deep link', () => {
    expect(resolveInput('Review this code', 'ai', 'claude', 'google')).toMatchObject({
      type: 'navigate',
      targetId: 'claude',
      url: 'https://claude.ai/new',
      copyText: 'Review this code',
    });
  });

  it('routes slash commands independently of the current mode', () => {
    expect(resolveInput('/youtube iPhone 18', 'ai', 'claude', 'bing')).toMatchObject({
      type: 'navigate',
      kind: 'search',
      targetId: 'youtube',
      url: 'https://www.youtube.com/results?search_query=iPhone%2018',
    });
  });

  it('switches destination when a slash command has no query', () => {
    expect(resolveInput('/deepseek', 'search', 'claude', 'google')).toEqual({
      type: 'switch',
      mode: 'ai',
      targetId: 'deepseek',
      label: 'DeepSeek',
    });
  });

  it('resolves local commands', () => {
    expect(resolveInput('/settings', 'ai', 'chatgpt', 'google')).toEqual({
      type: 'local',
      command: 'settings',
    });
  });

  it('prioritizes URLs and calculations over natural-language search', () => {
    expect(resolveInput('github.com', 'ai', 'chatgpt', 'google')).toMatchObject({
      type: 'navigate',
      kind: 'website',
    });
    expect(resolveInput('125 * 8', 'search', 'chatgpt', 'google')).toEqual({
      type: 'calculate',
      expression: '125 * 8',
      value: '1000',
    });
  });
});

describe('commandMatches', () => {
  it('provides prefix matches for the command panel', () => {
    expect(commandMatches('/you').map((command) => command.id)).toContain('youtube');
  });

  it('caps the suggestion list', () => {
    expect(commandMatches('/').length).toBeLessThanOrEqual(7);
  });
});
