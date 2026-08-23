import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, CornerDownLeft } from 'lucide-react';
import { CommandBar } from './components/CommandBar';
import { CommandPaletteDialog } from './components/CommandPaletteDialog';
import { OnboardingDialog } from './components/OnboardingDialog';
import { QuickLinks } from './components/QuickLinks';
import { RecentStrip } from './components/RecentStrip';
import { SettingsDialog, type SettingsSection } from './components/SettingsDialog';
import { ShortcutDialog } from './components/ShortcutDialog';
import { Toast, type ToastState } from './components/Toast';
import { TopBar } from './components/TopBar';
import { useTheme } from './hooks/useTheme';
import type { LocalCommand, ResolvedAction } from './lib/command';
import { useNovaStore } from './store/useNovaStore';
import type { AiProviderId, Mode, QuickLink, RecentItem, SearchEngineId, Theme } from './types';

const themeOrder: Theme[] = ['system', 'light', 'dark'];

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 5) return 'Still awake?';
  if (hour < 12) return 'Good morning.';
  if (hour < 18) return 'Good afternoon.';
  return 'Good evening.';
}

async function copyToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

export default function App() {
  const {
    hydrated,
    onboardingComplete,
    settings,
    quickLinks,
    recents,
    completeOnboarding,
    updateSettings,
    addQuickLink,
    updateQuickLink,
    removeQuickLink,
    restoreQuickLink,
    reorderQuickLinks,
    addRecent,
    clearRecents,
  } = useNovaStore();

  const [modeOverride, setModeOverride] = useState<Mode | null>(null);
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null);
  const [editingShortcut, setEditingShortcut] = useState<QuickLink | 'new' | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const navigationTimer = useRef<number | undefined>(undefined);
  const pointerFrame = useRef<number | undefined>(undefined);

  useTheme(settings.theme, settings.accent, settings.animations);
  const mode = modeOverride ?? settings.defaultMode;
  const setMode = useCallback((nextMode: Mode) => setModeOverride(nextMode), []);

  useEffect(() => {
    if (!hydrated || !onboardingComplete) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(timer);
  }, [hydrated, onboardingComplete]);

  useEffect(() => () => {
    window.clearTimeout(toastTimer.current);
    window.clearTimeout(navigationTimer.current);
    if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current);
  }, []);

  const showToast = useCallback((message: string, actionLabel?: string, onAction?: () => void, duration = 3200) => {
    window.clearTimeout(toastTimer.current);
    const next = { id: Date.now(), message, actionLabel, onAction };
    setToast(next);
    toastTimer.current = window.setTimeout(() => setToast((current) => (current?.id === next.id ? null : current)), duration);
  }, []);

  const cycleTheme = useCallback(() => {
    const next = themeOrder[(themeOrder.indexOf(settings.theme) + 1) % themeOrder.length];
    updateSettings({ theme: next });
    showToast(`Theme set to ${next}.`);
  }, [settings.theme, showToast, updateSettings]);

  const toggleFocus = useCallback(() => {
    updateSettings({ focusMode: !settings.focusMode });
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [settings.focusMode, updateSettings]);

  const handleLocalCommand = useCallback((command: LocalCommand) => {
    if (command === 'settings') setSettingsSection('general');
    if (command === 'apps') setEditingShortcut('new');
    if (command === 'theme') cycleTheme();
    if (command === 'focus') toggleFocus();
    if (command === 'palette') setPaletteOpen(true);
  }, [cycleTheme, toggleFocus]);

  const navigate = useCallback(async (action: Extract<ResolvedAction, { type: 'navigate' }>) => {
    addRecent({
      targetId: action.targetId,
      label: action.label,
      kind: action.kind,
      safeUrl: action.safeUrl,
    });

    if (action.copyText) {
      const copied = await copyToClipboard(action.copyText);
      showToast(
        copied ? 'Prompt copied — paste to continue.' : 'Clipboard unavailable — copy your prompt before continuing.',
        undefined,
        undefined,
        1200,
      );
      navigationTimer.current = window.setTimeout(() => window.location.assign(action.url), copied ? 620 : 1050);
      return;
    }
    window.location.assign(action.url);
  }, [addRecent, showToast]);

  const handleAction = useCallback((action: ResolvedAction) => {
    if (action.type === 'navigate') {
      void navigate(action);
      return;
    }
    if (action.type === 'local') {
      handleLocalCommand(action.command);
      return;
    }
    if (action.type === 'switch') {
      setMode(action.mode);
      if (action.mode === 'ai') updateSettings({ aiProvider: action.targetId as AiProviderId });
      else updateSettings({ searchEngine: action.targetId as SearchEngineId });
      showToast(`${action.label} is ready.`);
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    showToast(`Result: ${action.value}`);
  }, [handleLocalCommand, navigate, setMode, showToast, updateSettings]);

  const openQuickLink = useCallback((link: QuickLink) => {
    const safeUrl = new URL(link.url).origin;
    addRecent({ targetId: link.id, label: link.name, kind: 'website', safeUrl });
    window.location.assign(link.url);
  }, [addRecent]);

  const openRecent = useCallback((item: RecentItem) => {
    if (item.safeUrl) window.location.assign(item.safeUrl);
  }, []);

  const saveShortcut = useCallback((link: QuickLink) => {
    if (editingShortcut === 'new') addQuickLink(link);
    else updateQuickLink(link);
    setEditingShortcut(null);
    showToast(editingShortcut === 'new' ? `${link.name} added.` : `${link.name} updated.`);
  }, [addQuickLink, editingShortcut, showToast, updateQuickLink]);

  const deleteShortcut = useCallback((link: QuickLink) => {
    const index = quickLinks.findIndex((item) => item.id === link.id);
    removeQuickLink(link.id);
    setEditingShortcut(null);
    showToast(`${link.name} removed.`, 'Undo', () => {
      restoreQuickLink(link, index);
      setToast(null);
    }, 5000);
  }, [quickLinks, removeQuickLink, restoreQuickLink, showToast]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (modifier && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(false);
        setSettingsSection(null);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    if (!media.matches) return;
    const onPointerMove = (event: PointerEvent) => {
      if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current);
      pointerFrame.current = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        document.documentElement.style.setProperty('--pointer-x', x.toFixed(3));
        document.documentElement.style.setProperty('--pointer-y', y.toFixed(3));
      });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  if (!hydrated) {
    return (
      <div className="boot-screen" aria-label="Loading NOVA">
        <span className="nova-symbol large" />
      </div>
    );
  }

  const overlayOpen = !onboardingComplete || Boolean(settingsSection || editingShortcut || paletteOpen);
  const focusMode = settings.focusMode;

  return (
    <div className={focusMode ? 'app is-focus-mode' : 'app'}>
      <div className="ambient" aria-hidden="true"><span className="orbital-line" /></div>

      <div className="page-frame" inert={overlayOpen ? true : undefined}>
        <a className="skip-link" href="#main-content">Skip to command bar</a>
        <TopBar
          showClock={settings.showClock}
          focusMode={focusMode}
          onToggleFocus={toggleFocus}
          onOpenSettings={() => setSettingsSection('general')}
        />

        <main id="main-content" className="main-content">
          <AnimatePresence initial={false}>
            {settings.showGreeting && !focusMode && (
              <motion.div
                className="greeting"
                initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="greeting-index">{String(new Date().getDate()).padStart(2, '0')}</span>
                <h1>{greetingFor(new Date())}</h1>
                <p>Where to?</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="launcher"
            initial={{ opacity: 0, y: 12, filter: 'blur(7px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <CommandBar
              inputRef={inputRef}
              mode={mode}
              aiProvider={settings.aiProvider}
              searchEngine={settings.searchEngine}
              onModeChange={setMode}
              onAiProviderChange={(aiProvider) => updateSettings({ aiProvider })}
              onSearchEngineChange={(searchEngine) => updateSettings({ searchEngine })}
              onAction={handleAction}
            />
          </motion.div>

          <AnimatePresence initial={false}>
            {!focusMode && (
              <motion.div
                className="secondary-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {settings.showShortcuts && (
                  <QuickLinks
                    links={quickLinks}
                    onReorder={reorderQuickLinks}
                    onOpen={openQuickLink}
                    onEdit={setEditingShortcut}
                    onAdd={() => setEditingShortcut('new')}
                  />
                )}
                {settings.showRecent && (
                  <RecentStrip recents={recents} quickLinks={quickLinks} onOpen={openRecent} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="page-footer" aria-label="Keyboard shortcuts">
          <span><Command aria-hidden="true" size={12} /> K <em>Focus</em></span>
          <span><Command aria-hidden="true" size={12} /> ⇧ P <em>Commands</em></span>
          <span><CornerDownLeft aria-hidden="true" size={12} /> <em>Go</em></span>
        </footer>
      </div>

      {!onboardingComplete && (
        <OnboardingDialog
          settings={settings}
          onUpdate={(next) => {
            updateSettings(next);
            if (next.defaultMode) setMode(next.defaultMode);
          }}
          onComplete={() => {
            completeOnboarding();
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        />
      )}

      {settingsSection && (
        <SettingsDialog
          settings={settings}
          quickLinks={quickLinks}
          recentCount={recents.length}
          initialSection={settingsSection}
          onClose={() => setSettingsSection(null)}
          onUpdate={updateSettings}
          onAddShortcut={() => { setSettingsSection(null); setEditingShortcut('new'); }}
          onEditShortcut={(link) => { setSettingsSection(null); setEditingShortcut(link); }}
          onClearRecents={() => { clearRecents(); showToast('Recent destinations cleared.'); }}
        />
      )}

      {editingShortcut && (
        <ShortcutDialog
          link={editingShortcut === 'new' ? undefined : editingShortcut}
          onClose={() => setEditingShortcut(null)}
          onSave={saveShortcut}
          onDelete={editingShortcut === 'new' ? undefined : deleteShortcut}
        />
      )}

      {paletteOpen && (
        <CommandPaletteDialog
          theme={settings.theme}
          focusMode={settings.focusMode}
          onClose={() => setPaletteOpen(false)}
          onOpenSettings={() => setSettingsSection('general')}
          onAddShortcut={() => setEditingShortcut('new')}
          onCycleTheme={cycleTheme}
          onToggleFocus={toggleFocus}
          onSwitchAi={() => { setMode('ai'); requestAnimationFrame(() => inputRef.current?.focus()); }}
          onSwitchSearch={() => { setMode('search'); requestAnimationFrame(() => inputRef.current?.focus()); }}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
