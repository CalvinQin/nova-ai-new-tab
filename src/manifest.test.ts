import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(
  readFileSync(resolve(process.cwd(), 'public/manifest.json'), 'utf8'),
) as {
  manifest_version: number;
  name: string;
  description: string;
  default_locale: string;
  permissions: string[];
  chrome_url_overrides: { newtab: string };
  host_permissions?: string[];
  content_security_policy: { extension_pages: string };
};

const englishMessages = JSON.parse(
  readFileSync(resolve(process.cwd(), 'public/_locales/en/messages.json'), 'utf8'),
) as Record<string, { message: string }>;

const chineseMessages = JSON.parse(
  readFileSync(resolve(process.cwd(), 'public/_locales/zh_CN/messages.json'), 'utf8'),
) as Record<string, { message: string }>;

describe('Chrome extension manifest', () => {
  it('uses Manifest V3 and overrides the new tab page', () => {
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.chrome_url_overrides.newtab).toBe('index.html');
    expect(manifest.default_locale).toBe('en');
    expect(manifest.name).toBe('__MSG_extensionName__');
    expect(manifest.description).toBe('__MSG_extensionDescription__');
    expect(englishMessages.extensionDescription.message.length).toBeLessThanOrEqual(132);
    expect(chineseMessages.extensionDescription.message.length).toBeLessThanOrEqual(132);
  });

  it('requests only local storage and no host access', () => {
    expect(manifest.permissions).toEqual(['storage']);
    expect(manifest.host_permissions).toBeUndefined();
  });

  it('keeps scripts self-hosted under extension CSP', () => {
    expect(manifest.content_security_policy.extension_pages).toContain("script-src 'self'");
    expect(manifest.content_security_policy.extension_pages).not.toContain('unsafe-eval');
  });
});
