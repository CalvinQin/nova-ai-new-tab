import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Command, CornerDownLeft } from 'lucide-react';
import { CommandBar } from './components/CommandBar';
import { CommandPaletteDialog } from './components/CommandPaletteDialog';
import { OnboardingDialog } from './components/OnboardingDialog';
import { QuickLinks } from './components/QuickLinks';
import { RecentStrip } from './components/RecentStrip';
import { ServerStatusPanel } from './components/ServerStatusPanel';
import { SettingsDialog, type SettingsSection } from './components/SettingsDialog';
import { ShortcutDialog } from './components/ShortcutDialog';
import { Toast, type ToastState } from './components/Toast';
import { TopBar } from './components/TopBar';
import { I18nProvider } from './i18n';
import { MAX_QUICK_LINKS } from './data/catalog';
import { useTheme } from './hooks/useTheme';
import type { LocalCommand, ResolvedAction } from './lib/command';
import { useNovaStore } from './store/useNovaStore';
import { checkServer, endpointOriginPattern, requestServerAccess } from './lib/server-monitor';
import type { AiProviderId, Language, Mode, QuickLink, RecentItem, SearchEngineId, Theme } from './types';

const themeOrder: Theme[] = ['system', 'light', 'dark'];

function greetingFor(date: Date, language: Language) {
  const hour = date.getHours();
  const suffix = hour < 5 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  return language === 'zh-CN'
    ? ({ night: '还没休息？', morning: '早上好。', afternoon: '下午好。', evening: '晚上好。' }[suffix])
    : ({ night: 'Still awake?', morning: 'Good morning.', afternoon: 'Good afternoon.', evening: 'Good evening.' }[suffix]);
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
  const [checkingServerIds, setCheckingServerIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const navigationTimer = useRef<number | undefined>(undefined);
  const pointerFrame = useRef<number | undefined>(undefined);

  useTheme(settings.theme, settings.accent, settings.animations);
  useEffect(() => { document.documentElement.lang = settings.language === 'zh-CN' ? 'zh-CN' : 'en'; }, [settings.language]);
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
    if (command === 'apps') setSettingsSection('shortcuts');
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

  const openNewShortcut = useCallback(() => {
    if (quickLinks.length >= MAX_QUICK_LINKS) {
      showToast(`Maximum of ${MAX_QUICK_LINKS} shortcuts reached.`);
      return;
    }
    setEditingShortcut('new');
  }, [quickLinks.length, showToast]);

  const saveShortcut = useCallback((link: QuickLink) => {
    if (editingShortcut === 'new') {
      if (quickLinks.length >= MAX_QUICK_LINKS) {
        showToast(`Maximum of ${MAX_QUICK_LINKS} shortcuts reached.`);
        return;
      }
      addQuickLink(link);
    } else updateQuickLink(link);
    setEditingShortcut(null);
    showToast(editingShortcut === 'new' ? `${link.name} added.` : `${link.name} updated.`);
  }, [addQuickLink, editingShortcut, quickLinks.length, showToast, updateQuickLink]);

  const deleteShortcut = useCallback((link: QuickLink) => {
    const index = quickLinks.findIndex((item) => item.id === link.id);
    removeQuickLink(link.id);
    setEditingShortcut(null);
    showToast(`${link.name} removed.`, 'Undo', () => {
      const currentLinks = useNovaStore.getState().quickLinks;
      if (currentLinks.length >= MAX_QUICK_LINKS && !currentLinks.some((item) => item.id === link.id)) {
        showToast(`Remove another shortcut before restoring ${link.name}.`);
        return;
      }
      restoreQuickLink(link, index);
      setToast(null);
    }, 5000);
  }, [quickLinks, removeQuickLink, restoreQuickLink, showToast]);

  const checkConfiguredServer = useCallback(async (serverId: string) => {
    const server = settings.serverMonitor.servers.find((item) => item.id === serverId);
    const chinese = settings.language === 'zh-CN';
    if (!server || !endpointOriginPattern(server.healthUrl)) {
      showToast(chinese ? '请先填写有效的 HTTP(S) 健康检查地址。' : 'Add a valid HTTP(S) health URL first.');
      return;
    }
    const allowed = await requestServerAccess(server);
    if (!allowed) {
      showToast(chinese ? '浏览器未授予此服务器的访问权限。' : 'Browser access was not granted for this server.');
      return;
    }
    setCheckingServerIds((current) => [...new Set([...current, serverId])]);
    const currentMonitor = useNovaStore.getState().settings.serverMonitor;
    updateSettings({
      serverMonitor: {
        ...currentMonitor,
        servers: currentMonitor.servers.map((item) => item.id === serverId ? {
          ...item,
          status: 'checking',
          ports: item.ports.map((port) => ({ ...port, status: endpointOriginPattern(port.url) ? 'checking' : 'unknown' })),
        } : item),
      },
    });
    try {
      const checked = await checkServer(server);
      const latestMonitor = useNovaStore.getState().settings.serverMonitor;
      updateSettings({
        serverMonitor: {
          ...latestMonitor,
          servers: latestMonitor.servers.map((item) => item.id === serverId ? {
            ...item,
            status: checked.status,
            latency: checked.latency,
            checkedAt: checked.checkedAt,
            ports: item.ports.map((port) => {
              const checkedPort = checked.ports.find((candidate) => candidate.id === port.id);
              return checkedPort ? { ...port, status: checkedPort.status, latency: checkedPort.latency, checkedAt: checkedPort.checkedAt } : port;
            }),
          } : item),
        },
      });
    } finally {
      setCheckingServerIds((current) => current.filter((id) => id !== serverId));
    }
  }, [settings.language, settings.serverMonitor.servers, showToast, updateSettings]);

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
    <I18nProvider language={settings.language}>
    <MotionConfig reducedMotion={settings.animations ? 'user' : 'always'}>
    <div className={focusMode ? 'app is-focus-mode' : 'app'}>
      <div className="ambient" aria-hidden="true"><span className="orbital-line" /></div>

      <div className="page-frame" inert={overlayOpen ? true : undefined}>
        <a className="skip-link" href="#main-content">Skip to command bar</a>
          <TopBar
          showClock={settings.showClock}
          focusMode={focusMode}
          onToggleFocus={toggleFocus}
            onOpenSettings={() => setSettingsSection('general')}
            language={settings.language}
            onLanguageChange={(language) => updateSettings({ language })}
        />

        <main id="main-content" className="main-content">
          <AnimatePresence initial={false}>
            {settings.showGreeting && (
              <motion.div
                className="greeting"
                aria-hidden={focusMode || undefined}
                inert={focusMode ? true : undefined}
                initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="greeting-index">{String(new Date().getDate()).padStart(2, '0')}</span>
                <h1>{greetingFor(new Date(), settings.language)}</h1>
                <p>{settings.language === 'zh-CN' ? '下一步去哪里？' : 'Where to?'}</p>
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
              aiProviderOrder={settings.aiProviderOrder}
              searchEngineOrder={settings.searchEngineOrder}
              onModeChange={setMode}
              onAiProviderChange={(aiProvider) => updateSettings({ aiProvider })}
              onSearchEngineChange={(searchEngine) => updateSettings({ searchEngine })}
              onAction={handleAction}
            />
          </motion.div>

          <AnimatePresence initial={false}>
            <motion.div
              className="secondary-content"
              aria-hidden={focusMode || undefined}
              inert={focusMode ? true : undefined}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {settings.showShortcuts && (
                <QuickLinks
                  links={quickLinks}
                  onReorder={reorderQuickLinks}
                  onOpen={openQuickLink}
                  onEdit={setEditingShortcut}
                  onAdd={openNewShortcut}
                />
              )}
              <ServerStatusPanel
                monitor={settings.serverMonitor}
                refreshingServerIds={checkingServerIds}
                onRefresh={(serverId) => { void checkConfiguredServer(serverId); }}
                onConfigure={() => setSettingsSection('status')}
              />
              {settings.showRecent && (
                <RecentStrip recents={recents} quickLinks={quickLinks} onOpen={openRecent} />
              )}
            </motion.div>
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
          onAddShortcut={() => { setSettingsSection(null); openNewShortcut(); }}
          onEditShortcut={(link) => { setSettingsSection(null); setEditingShortcut(link); }}
          onClearRecents={() => { clearRecents(); showToast('Recent destinations cleared.'); }}
          onCheckServer={(serverId) => { void checkConfiguredServer(serverId); }}
          checkingServerIds={checkingServerIds}
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
          onOpenKeyboard={() => setSettingsSection('keyboard')}
          onAddShortcut={openNewShortcut}
          onCycleTheme={cycleTheme}
          onToggleFocus={toggleFocus}
          onSwitchAi={() => { setMode('ai'); requestAnimationFrame(() => inputRef.current?.focus()); }}
          onSwitchSearch={() => { setMode('search'); requestAnimationFrame(() => inputRef.current?.focus()); }}
        />
      )}

      <Toast toast={toast} />
    </div>
    </MotionConfig>
    </I18nProvider>
  );
}
