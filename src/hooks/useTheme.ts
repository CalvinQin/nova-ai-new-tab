import { useEffect } from 'react';
import type { Accent, Theme } from '../types';

export function useTheme(theme: Theme, accent: Accent, animations: boolean) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.dataset.accent = accent;
      document.documentElement.dataset.motion = animations ? 'full' : 'reduced';
      document.documentElement.style.colorScheme = resolved;
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        'content',
        resolved === 'dark' ? '#0d0e0d' : '#f4f2ed',
      );
    };

    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [accent, animations, theme]);
}
