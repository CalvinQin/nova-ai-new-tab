import { type KeyboardEvent, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Focus,
  LayoutGrid,
  MoonStar,
  Search,
  Settings,
  SunMedium,
  X,
} from 'lucide-react';

interface PaletteAction {
  id: string;
  label: string;
  detail: string;
  icon: typeof Settings;
  run: () => void;
}

interface CommandPaletteDialogProps {
  theme: 'light' | 'dark' | 'system';
  focusMode: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onAddShortcut: () => void;
  onCycleTheme: () => void;
  onToggleFocus: () => void;
  onSwitchAi: () => void;
  onSwitchSearch: () => void;
}

export function CommandPaletteDialog({
  theme,
  focusMode,
  onClose,
  onOpenSettings,
  onAddShortcut,
  onCycleTheme,
  onToggleFocus,
  onSwitchAi,
  onSwitchSearch,
}: CommandPaletteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const openDialog = (node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    if (node && !node.open) {
      node.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const actions = useMemo<PaletteAction[]>(() => [
    { id: 'settings', label: 'Open settings', detail: 'Preferences and privacy', icon: Settings, run: onOpenSettings },
    { id: 'shortcut', label: 'Add shortcut', detail: 'Create a quick destination', icon: LayoutGrid, run: onAddShortcut },
    { id: 'ai', label: 'Switch to AI', detail: 'Focus the command bar', icon: Bot, run: onSwitchAi },
    { id: 'search', label: 'Switch to Search', detail: 'Focus the command bar', icon: Search, run: onSwitchSearch },
    { id: 'focus', label: focusMode ? 'Leave Focus Mode' : 'Enter Focus Mode', detail: 'Show only the command bar', icon: Focus, run: onToggleFocus },
    { id: 'theme', label: 'Change theme', detail: `Currently ${theme}`, icon: theme === 'dark' ? SunMedium : MoonStar, run: onCycleTheme },
  ], [focusMode, onAddShortcut, onCycleTheme, onOpenSettings, onSwitchAi, onSwitchSearch, onToggleFocus, theme]);

  const filtered = actions.filter((action) => `${action.label} ${action.detail}`.toLowerCase().includes(query.toLowerCase()));
  const selectedIndex = filtered.length ? activeIndex % filtered.length : 0;

  const run = (action: PaletteAction) => {
    onClose();
    window.setTimeout(action.run, 40);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && filtered.length) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % filtered.length);
    } else if (event.key === 'ArrowUp' && filtered.length) {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + filtered.length) % filtered.length);
    } else if (event.key === 'Enter' && filtered[selectedIndex]) {
      event.preventDefault();
      run(filtered[selectedIndex]);
    }
  };

  return (
    <dialog
      ref={openDialog}
      className="nova-dialog palette-dialog"
      aria-labelledby="palette-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
    >
      <motion.div
        className="dialog-surface palette-surface"
        initial={{ opacity: 0, y: -12, scale: 0.985, filter: 'blur(7px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="palette-input-row">
          <Search aria-hidden="true" size={19} strokeWidth={1.7} />
          <input
            ref={inputRef}
            value={query}
            aria-label="Search commands"
            aria-controls="palette-actions"
            aria-activedescendant={filtered[selectedIndex] ? `palette-${filtered[selectedIndex].id}` : undefined}
            id="palette-dialog-title"
            placeholder="Type a command…"
            onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
            onKeyDown={onKeyDown}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette"><X size={16} /></button>
        </div>
        <div className="palette-actions" id="palette-actions" role="listbox">
          {filtered.length ? filtered.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                type="button"
                role="option"
                aria-selected={selectedIndex === index}
                id={`palette-${action.id}`}
                className={selectedIndex === index ? 'is-selected' : ''}
                key={action.id}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => run(action)}
              >
                <span><Icon aria-hidden="true" size={17} /></span>
                <span><strong>{action.label}</strong><small>{action.detail}</small></span>
                {selectedIndex === index && <kbd>↵</kbd>}
              </button>
            );
          }) : <div className="palette-empty">No command matches “{query}”.</div>}
        </div>
        <footer className="palette-footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>Esc</kbd> Close</span></footer>
      </motion.div>
    </dialog>
  );
}
