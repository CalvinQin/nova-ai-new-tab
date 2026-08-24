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
  Activity,
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
import { aiProviders, MAX_MONITORED_SERVERS, MAX_PORTS_PER_SERVER, MAX_QUICK_LINKS, searchEngines, serverProviders } from '../data/catalog';
import type {
  Accent,
  AiProviderId,
  Destination,
  Language,
  Mode,
  MonitoredServer,
  NovaSettings,
  QuickLink,
  SearchEngineId,
  ServerPort,
  ServerProvider,
  ServerRefreshInterval,
  Theme,
} from '../types';
import { BrandIcon } from './BrandIcon';
import { ServerVendorLogo } from './ServerVendorLogo';
import { useI18n } from '../i18n';

export type SettingsSection =
  | 'general'
  | 'ai'
  | 'search'
  | 'shortcuts'
  | 'status'
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
  onCheckServer: (serverId: string) => void;
  checkingServerIds: string[];
}

const sections: Array<{ id: SettingsSection; label: string; icon: typeof MonitorCog }> = [
  { id: 'general', label: 'General', icon: MonitorCog },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'shortcuts', label: 'Shortcuts', icon: LayoutGrid },
  { id: 'status', label: 'Status', icon: Activity },
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
  onCheckServer,
  checkingServerIds,
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
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
                <span>{({ general: t('settings.general'), ai: t('settings.ai'), search: t('settings.search'), shortcuts: t('settings.shortcuts'), status: t('settings.status'), appearance: t('settings.appearance'), privacy: t('settings.privacy'), keyboard: t('settings.keyboard'), about: t('settings.about') } as Record<SettingsSection, string>)[id]}</span>
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

            {section === 'status' && (
              <StatusMonitorEditor
                settings={settings}
                onUpdate={onUpdate}
                onCheckServer={onCheckServer}
                checkingServerIds={checkingServerIds}
              />
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
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
    >
      <header><h3 id={`settings-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</h3><p>{description}</p></header>
      {children}
    </motion.section>
  );
}

function KeyRow({ keys, label }: { keys: string[]; label: string }) {
  return <div className="key-row"><span>{label}</span><span>{keys.map((key) => <kbd key={key}>{key}</kbd>)}</span></div>;
}

function newId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

function createServer(provider: ServerProvider = 'baota'): MonitoredServer {
  const preset = serverProviders.find((item) => item.id === provider);
  return {
    id: newId('server'),
    name: provider === 'custom' ? '' : `${preset?.name ?? 'Server'} server`,
    provider,
    healthUrl: '',
    status: 'unknown',
    ports: [],
  };
}

function StatusMonitorEditor({ settings, onUpdate, onCheckServer, checkingServerIds }: Pick<SettingsDialogProps, 'settings' | 'onUpdate' | 'onCheckServer' | 'checkingServerIds'>) {
  const { t } = useI18n();
  const monitor = settings.serverMonitor;
  const updateServers = (servers: MonitoredServer[]) => onUpdate({ serverMonitor: { ...monitor, servers: servers.slice(0, MAX_MONITORED_SERVERS) } });
  const updateServer = (serverId: string, patch: Partial<MonitoredServer>) => updateServers(monitor.servers.map((server) => (
    server.id === serverId ? { ...server, ...patch } : server
  )));
  const updatePort = (server: MonitoredServer, portId: string, patch: Partial<ServerPort>) => updateServer(server.id, {
    ports: server.ports.map((port) => (port.id === portId ? { ...port, ...patch } : port)),
  });

  return (
    <SettingsPane title={t('settings.status.title')} description={t('settings.status.desc')}>
      <div className="settings-group">
        <Toggle checked={monitor.enabled} onChange={(enabled) => onUpdate({ serverMonitor: { ...monitor, enabled } })} label={t('settings.status.show')} description={t('settings.status.showDesc')} />
      </div>

      <div className="setting-row server-refresh-setting">
        <span><strong>{t('settings.status.live')}</strong><small>{t('settings.status.liveDesc')}</small></span>
        <label><span className="sr-only">{t('settings.status.interval')}</span><select value={monitor.refreshInterval} onChange={(event) => onUpdate({ serverMonitor: { ...monitor, refreshInterval: Number(event.target.value) as ServerRefreshInterval } })}>
          <option value={0}>{t('settings.status.intervalOff')}</option>
          <option value={30_000}>{t('settings.status.interval30')}</option>
          <option value={60_000}>{t('settings.status.interval60')}</option>
          <option value={300_000}>{t('settings.status.interval300')}</option>
        </select></label>
      </div>

      <div className="server-config-list">
        {monitor.servers.map((server) => (
          <section className="server-config" key={server.id} aria-label={server.name || t('status.unnamed')}>
            <header>
              <span className="server-config-provider"><ServerVendorLogo provider={server.provider} size={18} /></span>
              <strong>{server.name || t('status.unnamed')}</strong>
              <button type="button" className="server-remove" onClick={() => updateServers(monitor.servers.filter((item) => item.id !== server.id))}>{t('settings.status.removeServer')}</button>
            </header>

            <div className="server-config-fields">
              <label><span>{t('settings.status.name')}</span><input value={server.name} onChange={(event) => updateServer(server.id, { name: event.target.value })} placeholder={t('status.unnamed')} /></label>
              <label className="server-health-field"><span>{t('settings.status.healthUrl')}</span><input value={server.healthUrl} inputMode="url" onChange={(event) => updateServer(server.id, { healthUrl: event.target.value, status: 'unknown', latency: undefined, checkedAt: undefined })} placeholder="https://api.example.com/health" /><small>{t('settings.status.healthHint')}</small></label>
            </div>

            <div className="provider-presets" role="radiogroup" aria-label={t('settings.status.provider')}>
              {serverProviders.map((provider) => (
                <button type="button" role="radio" aria-checked={server.provider === provider.id} className={server.provider === provider.id ? 'is-selected' : ''} key={provider.id} onClick={() => updateServer(server.id, { provider: provider.id })}>
                  <ServerVendorLogo provider={provider.id} size={16} /> <span>{provider.name}</span>
                </button>
              ))}
            </div>

            <div className="server-port-settings">
              <div><strong>{t('settings.status.ports')}</strong><small>{t('settings.status.portLimit')}</small></div>
              {server.ports.map((port) => (
                <div className="server-port-row" key={port.id}>
                  <span className={`health-dot health-${port.status}`} aria-hidden="true" />
                  <label><span className="sr-only">{t('settings.status.portName')}</span><input value={port.name} onChange={(event) => updatePort(server, port.id, { name: event.target.value })} placeholder="Web · 443" /></label>
                  <label><span className="sr-only">{t('settings.status.portUrl')}</span><input value={port.url} inputMode="url" onChange={(event) => updatePort(server, port.id, { url: event.target.value, status: 'unknown', latency: undefined, checkedAt: undefined })} placeholder="https://app.example.com/health" /></label>
                  <button type="button" aria-label={t('settings.status.removePort', { name: port.name || t('settings.status.portName') })} onClick={() => updateServer(server.id, { ports: server.ports.filter((item) => item.id !== port.id) })}><X aria-hidden="true" size={14} /></button>
                </div>
              ))}
              <button type="button" className="server-add-port" disabled={server.ports.length >= MAX_PORTS_PER_SERVER} onClick={() => updateServer(server.id, { ports: [...server.ports, { id: newId('port'), name: '', url: '', status: 'unknown' }] })}>
                <Plus aria-hidden="true" size={14} /> {t('settings.status.addPort')}
              </button>
            </div>
            <button type="button" className="secondary-button server-connect" disabled={checkingServerIds.includes(server.id)} onClick={() => onCheckServer(server.id)}>
              <Activity aria-hidden="true" size={15} /> {checkingServerIds.includes(server.id) ? t('status.checking') : t('settings.status.connect')}
            </button>
          </section>
        ))}
      </div>

      <div className="server-add-row">
        <button type="button" className="secondary-button" disabled={monitor.servers.length >= MAX_MONITORED_SERVERS} onClick={() => updateServers([...monitor.servers, createServer()])}>
          <Plus aria-hidden="true" size={16} /> {t('settings.status.add')}
        </button>
        <small>{t('settings.status.limit')}</small>
      </div>
    </SettingsPane>
  );
}
