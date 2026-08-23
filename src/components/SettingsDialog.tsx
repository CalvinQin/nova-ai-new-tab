import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Eye,
  Info,
  Keyboard,
  LayoutGrid,
  LockKeyhole,
  MonitorCog,
  Palette,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { aiProviders, MAX_QUICK_LINKS, searchEngines } from '../data/catalog';
import type {
  Accent,
  AiProviderId,
  Mode,
  NovaSettings,
  QuickLink,
  SearchEngineId,
  Theme,
} from '../types';
import { BrandIcon } from './BrandIcon';

export type SettingsSection =
  | 'general'
  | 'ai'
  | 'search'
  | 'shortcuts'
  | 'appearance'
  | 'privacy'
  | 'keyboard'
  | 'about';

interface SettingsDialogProps {
  settings: NovaSettings;
  quickLinks: QuickLink[];
  recentCount: number;
  initialSection?: SettingsSection;
  onClose: () => void;
  onUpdate: (settings: Partial<NovaSettings>) => void;
  onAddShortcut: () => void;
  onEditShortcut: (link: QuickLink) => void;
  onClearRecents: () => void;
}

const sections: Array<{ id: SettingsSection; label: string; icon: typeof MonitorCog }> = [
  { id: 'general', label: 'General', icon: MonitorCog },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'shortcuts', label: 'Shortcuts', icon: LayoutGrid },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: LockKeyhole },
  { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
  { id: 'about', label: 'About', icon: Info },
];

function Toggle({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="setting-row toggle-row">
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="toggle-track" aria-hidden="true"><span /></span>
    </label>
  );
}

function Segmented<T extends string>({ value, options, onChange, label }: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="setting-block">
      <div className="setting-label">{label}</div>
      <div className="settings-segmented" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            type="button"
            role="radio"
            aria-checked={value === option.value}
            className={value === option.value ? 'is-selected' : ''}
            key={option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsDialog({
  settings,
  quickLinks,
  recentCount,
  initialSection = 'general',
  onClose,
  onUpdate,
  onAddShortcut,
  onEditShortcut,
  onClearRecents,
}: SettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [section, setSection] = useState<SettingsSection>(initialSection);

  const openDialog = (node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    if (node && !node.open) node.showModal();
  };

  return (
    <dialog
      ref={openDialog}
      className="nova-dialog settings-dialog"
      aria-labelledby="settings-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <motion.div
        className="dialog-surface settings-surface"
        initial={{ opacity: 0, x: 24, filter: 'blur(7px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="settings-header">
          <div>
            <span className="dialog-eyebrow">NOVA</span>
            <h2 id="settings-dialog-title">Settings</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close settings">
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div className="settings-layout">
          <nav className="settings-nav" aria-label="Settings sections">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                className={section === id ? 'is-active' : ''}
                aria-current={section === id ? 'page' : undefined}
                key={id}
                onClick={() => setSection(id)}
              >
                <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="settings-content" key={section}>
            {section === 'general' && (
              <SettingsPane title="General" description="Choose what a fresh tab feels like.">
                <Segmented<Mode>
                  label="Default mode"
                  value={settings.defaultMode}
                  options={[{ value: 'ai', label: 'AI' }, { value: 'search', label: 'Search' }]}
                  onChange={(defaultMode) => onUpdate({ defaultMode })}
                />
                <div className="settings-group">
                  <Toggle checked={settings.showGreeting} onChange={(showGreeting) => onUpdate({ showGreeting })} label="Greeting" />
                  <Toggle checked={settings.showClock} onChange={(showClock) => onUpdate({ showClock })} label="Clock" />
                  <Toggle checked={settings.showShortcuts} onChange={(showShortcuts) => onUpdate({ showShortcuts })} label="Quick links" />
                  <Toggle checked={settings.showRecent} onChange={(showRecent) => onUpdate({ showRecent })} label="Recent destinations" />
                  <Toggle checked={settings.focusMode} onChange={(focusMode) => onUpdate({ focusMode })} label="Focus Mode" description="Keep only the command bar visible." />
                  <Toggle checked={settings.animations} onChange={(animations) => onUpdate({ animations })} label="Motion" description="Respects the system reduced-motion preference." />
                </div>
              </SettingsPane>
            )}

            {section === 'ai' && (
              <SettingsPane title="AI provider" description="NOVA opens the provider you choose. No AI API is called.">
                <div className="destination-grid" role="radiogroup" aria-label="Default AI provider">
                  {Object.values(aiProviders).map((provider) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={settings.aiProvider === provider.id}
                      className={settings.aiProvider === provider.id ? 'destination-card is-selected' : 'destination-card'}
                      key={provider.id}
                      onClick={() => onUpdate({ aiProvider: provider.id as AiProviderId })}
                    >
                      <BrandIcon icon={provider.icon} size={20} />
                      <span><strong>{provider.name}</strong>{provider.note && <small>Clipboard handoff</small>}</span>
                    </button>
                  ))}
                </div>
              </SettingsPane>
            )}

            {section === 'search' && (
              <SettingsPane title="Search engine" description="Pick the destination used in Search mode.">
                <div className="destination-grid" role="radiogroup" aria-label="Default search engine">
                  {Object.values(searchEngines).map((engine) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={settings.searchEngine === engine.id}
                      className={settings.searchEngine === engine.id ? 'destination-card is-selected' : 'destination-card'}
                      key={engine.id}
                      onClick={() => onUpdate({ searchEngine: engine.id as SearchEngineId })}
                    >
                      <BrandIcon icon={engine.icon} size={19} />
                      <strong>{engine.name}</strong>
                    </button>
                  ))}
                </div>
              </SettingsPane>
            )}

            {section === 'shortcuts' && (
              <SettingsPane title="Quick links" description="Edit here or drag the dock to reorder.">
                <div className="settings-shortcut-list">
                  {quickLinks.map((link) => (
                    <button type="button" key={link.id} onClick={() => onEditShortcut(link)}>
                      <span className="settings-shortcut-icon"><BrandIcon icon={link.icon} iconUrl={link.iconUrl} size={17} /></span>
                      <span><strong>{link.name}</strong><small>{new URL(link.url).hostname}</small></span>
                      <span>Edit</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="secondary-button full-width" onClick={onAddShortcut} disabled={quickLinks.length >= MAX_QUICK_LINKS}>
                  <Plus aria-hidden="true" size={16} />
                  {quickLinks.length >= MAX_QUICK_LINKS ? `Maximum of ${MAX_QUICK_LINKS} shortcuts reached` : 'Add shortcut'}
                </button>
              </SettingsPane>
            )}

            {section === 'appearance' && (
              <SettingsPane title="Appearance" description="A small amount of color, used with restraint.">
                <Segmented<Theme>
                  label="Theme"
                  value={settings.theme}
                  options={[
                    { value: 'system', label: 'System' },
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                  ]}
                  onChange={(theme) => onUpdate({ theme })}
                />
                <div className="setting-block">
                  <div className="setting-label">Accent</div>
                  <div className="accent-options" role="radiogroup" aria-label="Accent color">
                    {(['neutral', 'blue', 'purple', 'green', 'orange'] as Accent[]).map((accent) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={settings.accent === accent}
                        className={settings.accent === accent ? `accent-${accent} is-selected` : `accent-${accent}`}
                        aria-label={accent}
                        key={accent}
                        onClick={() => onUpdate({ accent })}
                      ><span /></button>
                    ))}
                  </div>
                </div>
              </SettingsPane>
            )}

            {section === 'privacy' && (
              <SettingsPane title="Privacy" description="Your launcher data stays on this device.">
                <div className="privacy-note">
                  <LockKeyhole aria-hidden="true" size={20} />
                  <div>
                    <strong>No AI backend. No prompt history.</strong>
                    <p>NOVA stores settings, quick links, and destination names in chrome.storage.local. Search text and AI prompts are never added to Recent.</p>
                  </div>
                </div>
                <div className="setting-row">
                  <span><strong>Recent destinations</strong><small>{recentCount} saved locally</small></span>
                  <button type="button" className="danger-button" onClick={onClearRecents} disabled={!recentCount}>
                    <Trash2 aria-hidden="true" size={15} /> Clear recent
                  </button>
                </div>
              </SettingsPane>
            )}

            {section === 'keyboard' && (
              <SettingsPane title="Keyboard" description="The pointer is optional.">
                <div className="key-list">
                  <KeyRow keys={['Tab']} label="Switch AI and Search" />
                  <KeyRow keys={['⌘', 'K']} label="Focus command bar" />
                  <KeyRow keys={['⌘', '⇧', 'P']} label="Open command palette" />
                  <KeyRow keys={['↑', '↓']} label="Navigate suggestions" />
                  <KeyRow keys={['Enter']} label="Run selected action" />
                  <KeyRow keys={['Esc']} label="Close the current layer" />
                  <KeyRow keys={['/']} label="Start a slash command" />
                </div>
              </SettingsPane>
            )}

            {section === 'about' && (
              <SettingsPane title="NOVA" description="A lightweight browser OS launcher.">
                <div className="about-mark"><span className="nova-symbol large" /><strong>Version 0.1.0</strong></div>
                <p className="about-copy">Built around one calm loop: input, Tab, Enter. NOVA sends you to the services you choose and stays out of the way.</p>
                <div className="permission-row"><Eye aria-hidden="true" size={17} /><span><strong>One permission</strong><small>Local storage only</small></span></div>
              </SettingsPane>
            )}
          </div>
        </div>
      </motion.div>
    </dialog>
  );
}

function SettingsPane({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="settings-pane"
      aria-labelledby={`settings-${title.toLowerCase().replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <header><h3 id={`settings-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</h3><p>{description}</p></header>
      {children}
    </motion.section>
  );
}

function KeyRow({ keys, label }: { keys: string[]; label: string }) {
  return <div className="key-row"><span>{label}</span><span>{keys.map((key) => <kbd key={key}>{key}</kbd>)}</span></div>;
}
