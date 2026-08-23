import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { defaultQuickLinks } from '../data/catalog';
import type { NovaSettings, QuickLink, RecentItem } from '../types';

const defaultSettings: NovaSettings = {
  defaultMode: 'ai',
  aiProvider: 'chatgpt',
  searchEngine: 'google',
  theme: 'system',
  accent: 'neutral',
  showClock: true,
  showGreeting: true,
  showRecent: true,
  showShortcuts: true,
  focusMode: false,
  animations: true,
};

const chromeStorage: StateStorage = {
  async getItem(name) {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const result = await chrome.storage.local.get(name);
      return typeof result[name] === 'string' ? result[name] : null;
    }
    return globalThis.localStorage?.getItem(name) ?? null;
  },
  async setItem(name, value) {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [name]: value });
      return;
    }
    globalThis.localStorage?.setItem(name, value);
  },
  async removeItem(name) {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.remove(name);
      return;
    }
    globalThis.localStorage?.removeItem(name);
  },
};

interface NovaState {
  hydrated: boolean;
  onboardingComplete: boolean;
  settings: NovaSettings;
  quickLinks: QuickLink[];
  recents: RecentItem[];
  markHydrated: () => void;
  completeOnboarding: () => void;
  updateSettings: (settings: Partial<NovaSettings>) => void;
  addQuickLink: (link: QuickLink) => void;
  updateQuickLink: (link: QuickLink) => void;
  removeQuickLink: (id: string) => void;
  restoreQuickLink: (link: QuickLink, index: number) => void;
  reorderQuickLinks: (links: QuickLink[]) => void;
  addRecent: (item: Omit<RecentItem, 'id' | 'timestamp'>) => void;
  clearRecents: () => void;
}

export const useNovaStore = create<NovaState>()(
  persist(
    (set) => ({
      hydrated: false,
      onboardingComplete: false,
      settings: defaultSettings,
      quickLinks: defaultQuickLinks,
      recents: [],
      markHydrated: () => set({ hydrated: true }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      updateSettings: (next) =>
        set((state) => ({ settings: { ...state.settings, ...next } })),
      addQuickLink: (link) =>
        set((state) => ({ quickLinks: [...state.quickLinks, link].slice(0, 12) })),
      updateQuickLink: (link) =>
        set((state) => ({
          quickLinks: state.quickLinks.map((item) => (item.id === link.id ? link : item)),
        })),
      removeQuickLink: (id) =>
        set((state) => ({ quickLinks: state.quickLinks.filter((item) => item.id !== id) })),
      restoreQuickLink: (link, index) =>
        set((state) => {
          const next = [...state.quickLinks];
          next.splice(Math.min(index, next.length), 0, link);
          return { quickLinks: next };
        }),
      reorderQuickLinks: (links) => set({ quickLinks: links }),
      addRecent: (item) =>
        set((state) => ({
          recents: [
            {
              ...item,
              id: `${item.kind}-${item.targetId}-${Date.now()}`,
              timestamp: Date.now(),
            },
            ...state.recents.filter(
              (recent) => !(recent.targetId === item.targetId && recent.kind === item.kind),
            ),
          ].slice(0, 6),
        })),
      clearRecents: () => set({ recents: [] }),
    }),
    {
      name: 'nova-state-v1',
      storage: createJSONStorage(() => chromeStorage),
      partialize: ({ onboardingComplete, settings, quickLinks, recents }) => ({
        onboardingComplete,
        settings,
        quickLinks,
        recents,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<NovaState> | undefined;
        return {
          ...current,
          ...saved,
          settings: { ...defaultSettings, ...saved?.settings },
          quickLinks: saved?.quickLinks?.length ? saved.quickLinks : defaultQuickLinks,
        };
      },
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    },
  ),
);

export { defaultSettings };
