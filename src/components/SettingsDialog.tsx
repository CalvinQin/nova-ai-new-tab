import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import packageJson from '../../package.json';
import {
  Bot,
  Eye,
  GripVertical,
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
  Destination,
  Language,
  Mode,
  NovaSettings,
  QuickLink,
  SearchEngineId,
  Theme,
} from '../types';
import { BrandIcon } from './BrandIcon';
import { useI18n } from '../i18n';

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

interface DestinationRankerProps<T extends AiProviderId | SearchEngineId> {
  ids: T[];
  destinations: Record<T, Destination>;
  selectedId: T;
  onSelect: (id: T) => void;
  onReorder: (ids: T[]) => void;
}

function SortableDestination({ destination, selected, onSelect }: {
  destination: Destination;
  selected: boolean;
  onSelect: () => void;
}) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: destination.id });
  return (
    <div ref={setNodeRef} className={selected ? 'destination-card is-selected' : 'destination-card'} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.28 : 1 }}>
      <button type="button" className="destination-card-main" role="radio" aria-checked={selected} onClick={onSelect}>
        <BrandIcon icon={destination.icon} size={20} />
        <span><strong>{destination.name}</strong>{destination.region === 'china' && <small>{t('settings.china')}</small>}{destination.note && <small>{t('picker.copies')}</small>}</span>
      </button>
      <button type="button" className="destination-card-drag" aria-label={t('settings.drag', { name: destination.name })} {...attributes} {...listeners}>
        <GripVertical aria-hidden="true" size={15} />
      </button>
    </div>
  );
}

function DestinationRanker<T extends AiProviderId | SearchEngineId>({ ids, destinations, selectedId, onSelect, onReorder }: DestinationRankerProps<T>) {
  const [activeId, setActiveId] = useState<T | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const active = activeId ? destinations[activeId] : null;
  const handleDragEnd = ({ active: dragged, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || dragged.id === over.id) return;
    const oldIndex = ids.indexOf(dragged.id as T);
    const newIndex = ids.indexOf(over.id as T);
    if (oldIndex >= 0 && newIndex >= 0) onReorder(arrayMove(ids, oldIndex, newIndex));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={({ active: dragged }: DragStartEvent) => setActiveId(dragged.id as T)} onDragCancel={() => setActiveId(null)} onDragEnd={handleDragEnd}>
      <div className="destination-grid destination-ranker" role="radiogroup">
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          {ids.map((id) => <SortableDestination key={id} destination={destinations[id]} selected={selectedId === id} onSelect={() => onSelect(id)} />)}
        </SortableContext>
      </div>
      <DragOverlay dropAnimation={{ duration: 160, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {active && <div className="destination-card is-lifted"><BrandIcon icon={active.icon} size={20} /><span><strong>{active.name}</strong></span></div>}
      </DragOverlay>
    </DndContext>
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
  const { t } = useI18n();
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
            <h2 id="settings-dialog-title">{t('settings.title')}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label={t('settings.close')}>
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div className="settings-layout">
          <nav className="settings-nav" aria-label="Settings sections">
            {sections.map(({ id, icon: Icon }) => (
              <button
                type="button"
                className={section === id ? 'is-active' : ''}
                aria-current={section === id ? 'page' : undefined}
                key={id}
                onClick={() => setSection(id)}
              >
                <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                <span>{({ general: t('settings.general'), ai: t('settings.ai'), search: t('settings.search'), shortcuts: t('settings.shortcuts'), appearance: t('settings.appearance'), privacy: t('settings.privacy'), keyboard: t('settings.keyboard'), about: t('settings.about') } as Record<SettingsSection, string>)[id]}</span>
              </button>
            ))}
          </nav>

          <div className="settings-content" key={section}>
            {section === 'general' && (
              <SettingsPane title={t('settings.general')} description={t('settings.general.desc')}>
                <Segmented<Mode>
                  label={t('settings.defaultMode')}
                  value={settings.defaultMode}
                  options={[{ value: 'ai', label: t('mode.ai') }, { value: 'search', label: t('mode.search') }]}
                  onChange={(defaultMode) => onUpdate({ defaultMode })}
                />
                <Segmented<Language>
                  label={t('language.name')}
                  value={settings.language}
                  options={[{ value: 'en', label: '🇺🇸 English' }, { value: 'zh-CN', label: '🇨🇳 简体中文' }]}
                  onChange={(language) => onUpdate({ language })}
                />
                <div className="settings-group">
                  <Toggle checked={settings.showGreeting} onChange={(showGreeting) => onUpdate({ showGreeting })} label={t('settings.greeting')} />
                  <Toggle checked={settings.showClock} onChange={(showClock) => onUpdate({ showClock })} label={t('settings.clock')} />
                  <Toggle checked={settings.showShortcuts} onChange={(showShortcuts) => onUpdate({ showShortcuts })} label={t('settings.quickLinks')} />
                  <Toggle checked={settings.showRecent} onChange={(showRecent) => onUpdate({ showRecent })} label={t('settings.recents')} />
                  <Toggle checked={settings.focusMode} onChange={(focusMode) => onUpdate({ focusMode })} label={t('settings.focus')} description={t('settings.focus.desc')} />
                  <Toggle checked={settings.animations} onChange={(animations) => onUpdate({ animations })} label={t('settings.motion')} description={t('settings.motion.desc')} />
                </div>
              </SettingsPane>
            )}

            {section === 'ai' && (
              <SettingsPane title={t('settings.ai.title')} description={t('settings.ai.desc')}>
                <DestinationRanker<AiProviderId> ids={settings.aiProviderOrder} destinations={aiProviders} selectedId={settings.aiProvider} onSelect={(aiProvider) => onUpdate({ aiProvider })} onReorder={(aiProviderOrder) => onUpdate({ aiProviderOrder })} />
              </SettingsPane>
            )}

            {section === 'search' && (
              <SettingsPane title={t('settings.search.title')} description={t('settings.search.desc')}>
                <DestinationRanker<SearchEngineId> ids={settings.searchEngineOrder} destinations={searchEngines} selectedId={settings.searchEngine} onSelect={(searchEngine) => onUpdate({ searchEngine })} onReorder={(searchEngineOrder) => onUpdate({ searchEngineOrder })} />
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
                <div className="about-mark"><span className="nova-symbol large" /><strong>Version {packageJson.version}</strong></div>
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
