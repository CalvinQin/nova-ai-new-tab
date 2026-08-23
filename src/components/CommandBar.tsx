import {
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Calculator,
  Check,
  ChevronDown,
  Command,
  CornerDownLeft,
  Globe2,
  Search,
} from 'lucide-react';
import { aiProviders, searchEngines } from '../data/catalog';
import {
  commandMatches,
  resolveInput,
  type ResolvedAction,
} from '../lib/command';
import type { AiProviderId, Destination, Mode, SearchEngineId } from '../types';
import { BrandIcon } from './BrandIcon';

interface Suggestion {
  id: string;
  title: string;
  meta: string;
  action: ResolvedAction;
  icon?: Destination['icon'];
}

interface DestinationPickerProps {
  mode: Mode;
  selectedId: AiProviderId | SearchEngineId;
  onSelect: (id: AiProviderId | SearchEngineId) => void;
}

function DestinationPicker({ mode, selectedId, onSelect }: DestinationPickerProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const destinations = useMemo(
    () => Object.values(mode === 'ai' ? aiProviders : searchEngines),
    [mode],
  );
  const selected = destinations.find((destination) => destination.id === selectedId) ?? destinations[0];

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => menuRef.current?.focus());

    const closeOnPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', closeOnPointerDown);
    return () => window.removeEventListener('pointerdown', closeOnPointerDown);
  }, [destinations, open, selectedId]);

  const openPicker = () => {
    setHighlighted(Math.max(
      0,
      destinations.findIndex((destination) => destination.id === selectedId),
    ));
    setOpen(true);
  };

  const choose = (destination: Destination) => {
    onSelect(destination.id);
    setOpen(false);
    requestAnimationFrame(() => rootRef.current?.querySelector('button')?.focus());
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setHighlighted((current) => (current + direction + destinations.length) % destinations.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(destinations[highlighted]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className="destination-picker" ref={rootRef}>
      <button
        type="button"
        className="destination-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Current ${mode === 'ai' ? 'AI provider' : 'search engine'}: ${selected.name}`}
        onClick={() => (open ? setOpen(false) : openPicker())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            openPicker();
          }
        }}
      >
        <BrandIcon icon={selected.icon} size={19} />
        <span>{selected.shortName ?? selected.name}</span>
        <ChevronDown aria-hidden="true" size={14} strokeWidth={1.8} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            className="destination-menu"
            role="listbox"
            aria-label={mode === 'ai' ? 'AI providers' : 'Search engines'}
            tabIndex={-1}
            initial={{ opacity: 0, y: -6, scale: 0.985, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, scale: 0.99, filter: 'blur(3px)' }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={handleMenuKeyDown}
          >
            <div className="picker-label">{mode === 'ai' ? 'Ask with' : 'Search with'}</div>
            {destinations.map((destination, index) => (
              <button
                type="button"
                role="option"
                aria-selected={destination.id === selectedId}
                className={highlighted === index ? 'picker-option is-highlighted' : 'picker-option'}
                key={destination.id}
                onPointerMove={() => setHighlighted(index)}
                onClick={() => choose(destination)}
              >
                <span
                  className="picker-icon"
                  style={{ '--brand': destination.brandColor } as React.CSSProperties}
                >
                  <BrandIcon icon={destination.icon} size={18} />
                </span>
                <span className="picker-copy">
                  <strong>{destination.name}</strong>
                  {destination.note && <small>Copies prompt</small>}
                </span>
                {destination.id === selectedId && <Check aria-hidden="true" size={15} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CommandBarProps {
  inputRef: RefObject<HTMLInputElement | null>;
  mode: Mode;
  aiProvider: AiProviderId;
  searchEngine: SearchEngineId;
  onModeChange: (mode: Mode) => void;
  onAiProviderChange: (provider: AiProviderId) => void;
  onSearchEngineChange: (engine: SearchEngineId) => void;
  onAction: (action: ResolvedAction) => void;
}

export function CommandBar({
  inputRef,
  mode,
  aiProvider,
  searchEngine,
  onModeChange,
  onAiProviderChange,
  onSearchEngineChange,
  onAction,
}: CommandBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const destination = mode === 'ai' ? aiProviders[aiProvider] : searchEngines[searchEngine];

  const suggestions = useMemo<Suggestion[]>(() => {
    const value = query.trim();
    if (!value) return [];

    if (value.startsWith('/')) {
      const exact = resolveInput(value, mode, aiProvider, searchEngine);
      if (exact) {
        const command = commandMatches(value)[0];
        return [{
          id: `exact-${value}`,
          title: command?.label ?? value.split(/\s+/)[0],
          meta: command?.description ?? 'Run command',
          action: exact,
        }];
      }
      return commandMatches(value).map((command) => {
        const action = resolveInput(command.label, mode, aiProvider, searchEngine)!;
        return {
          id: command.id,
          title: command.label,
          meta: command.description,
          action,
        };
      });
    }

    const primary = resolveInput(value, mode, aiProvider, searchEngine);
    if (!primary) return [];
    if (primary.type === 'calculate') {
      return [{
        id: 'calculation',
        title: primary.value,
        meta: primary.expression,
        action: primary,
      }];
    }
    if (primary.type === 'navigate' && primary.kind === 'website') {
      return [{
        id: 'open-url',
        title: `Open ${primary.label}`,
        meta: primary.url,
        action: primary,
      }];
    }

    const aiCandidate: [string, string, string, ResolvedAction | null, Destination['icon']] = [
        `ai-${aiProvider}`,
        `Ask ${aiProviders[aiProvider].name}`,
        value,
        resolveInput(`/${aiProvider} ${value}`, mode, aiProvider, searchEngine),
        aiProviders[aiProvider].icon,
      ];
    const searchCandidate: [string, string, string, ResolvedAction | null, Destination['icon']] = [
        `search-${searchEngine}`,
        `Search ${searchEngines[searchEngine].name}`,
        value,
        resolveInput(`/${searchEngine} ${value}`, mode, aiProvider, searchEngine),
        searchEngines[searchEngine].icon,
      ];
    const candidates: Array<[string, string, string, ResolvedAction | null, Destination['icon']]> = [
      ...(mode === 'ai' ? [aiCandidate, searchCandidate] : [searchCandidate, aiCandidate]),
      [
        'search-youtube',
        'Search YouTube',
        value,
        resolveInput(`/youtube ${value}`, mode, aiProvider, searchEngine),
        'youtube',
      ],
      [
        'search-github',
        'Search GitHub',
        value,
        resolveInput(`/github ${value}`, mode, aiProvider, searchEngine),
        'github',
      ],
    ];

    const unique = new Set<string>();
    return candidates
      .filter((candidate) => {
        if (!candidate[3] || unique.has(candidate[0])) return false;
        unique.add(candidate[0]);
        return true;
      })
      .map(([id, title, meta, action, icon]) => ({ id, title, meta, action: action!, icon }));
  }, [aiProvider, mode, query, searchEngine]);

  const showSuggestions = focused && suggestions.length > 0;
  const boundedIndex = suggestions.length ? activeIndex % suggestions.length : 0;

  const runAction = (action: ResolvedAction | null | undefined) => {
    if (!action) return;
    onAction(action);
    if (action.type === 'calculate') {
      setQuery(action.value);
      setFocused(false);
      requestAnimationFrame(() => inputRef.current?.select());
    } else if (action.type === 'switch' || action.type === 'local') {
      setQuery('');
    }
  };

  const execute = () => {
    runAction(
      showSuggestions
        ? suggestions[boundedIndex]?.action
        : resolveInput(query, mode, aiProvider, searchEngine),
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      onModeChange(mode === 'ai' ? 'search' : 'ai');
      setActiveIndex(0);
      return;
    }
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      execute();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <section className="command-stage" aria-label="Universal command bar">
      <div className="mode-switch" role="tablist" aria-label="Command mode">
        {(['ai', 'search'] as const).map((item) => (
          <button
            type="button"
            key={item}
            role="tab"
            aria-selected={mode === item}
            tabIndex={mode === item ? 0 : -1}
            onClick={() => onModeChange(item)}
          >
            {mode === item && (
              <motion.span
                className="mode-indicator"
                layoutId="mode-indicator"
                transition={{ type: 'spring', stiffness: 480, damping: 38, mass: 0.7 }}
              />
            )}
            <span className="mode-label">{item === 'ai' ? 'AI' : 'Search'}</span>
          </button>
        ))}
        <span className="mode-tab-hint">Tab</span>
      </div>

      <div className={focused ? 'command-shell is-focused' : 'command-shell'}>
        <div className="command-row">
          <DestinationPicker
            mode={mode}
            selectedId={mode === 'ai' ? aiProvider : searchEngine}
            onSelect={(id) => {
              if (mode === 'ai') onAiProviderChange(id as AiProviderId);
              else onSearchEngineChange(id as SearchEngineId);
              inputRef.current?.focus();
            }}
          />
          <span className="command-divider" aria-hidden="true" />
          <input
            ref={inputRef}
            className="command-input"
            value={query}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={mode === 'ai' ? `Ask ${destination.name}` : `Search with ${destination.name}`}
            aria-autocomplete="list"
            aria-controls="command-suggestions"
            aria-activedescendant={showSuggestions ? `suggestion-${suggestions[boundedIndex]?.id}` : undefined}
            placeholder={mode === 'ai' ? 'Ask anything…' : 'Search anything…'}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            onKeyDown={handleKeyDown}
          />
          <div className="command-key" aria-hidden="true">
            <Command size={13} strokeWidth={1.8} /> K
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showSuggestions && (
            <motion.div
              className="suggestion-panel"
              id="command-suggestions"
              role="listbox"
              initial={{ opacity: 0, y: -7, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4, filter: 'blur(3px)' }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {suggestions.map((suggestion, index) => {
                const selected = boundedIndex === index;
                const action = suggestion.action;
                return (
                  <button
                    type="button"
                    id={`suggestion-${suggestion.id}`}
                    role="option"
                    aria-selected={selected}
                    className={selected ? 'suggestion-row is-selected' : 'suggestion-row'}
                    key={suggestion.id}
                    onPointerMove={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => runAction(action)}
                  >
                    <span className="suggestion-icon">
                      {action.type === 'calculate' ? (
                        <Calculator size={18} />
                      ) : action.type === 'navigate' && action.kind === 'website' ? (
                        <Globe2 size={18} />
                      ) : suggestion.icon ? (
                        <BrandIcon icon={suggestion.icon} size={17} />
                      ) : (
                        <Search size={18} />
                      )}
                    </span>
                    <span className="suggestion-copy">
                      <strong>{suggestion.title}</strong>
                      <small>{suggestion.meta}</small>
                    </span>
                    {selected ? (
                      <span className="suggestion-enter"><CornerDownLeft size={14} /> Enter</span>
                    ) : (
                      <ArrowUpRight className="suggestion-arrow" size={15} />
                    )}
                  </button>
                );
              })}
              <div className="suggestion-footer">
                <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                <span><kbd>Esc</kbd> Close</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="context-chips" aria-label="Command shortcuts">
        <button type="button" onClick={() => { onModeChange('ai'); inputRef.current?.focus(); }}>
          <BrandIcon icon={aiProviders[aiProvider].icon} size={13} /> Ask AI
        </button>
        <button type="button" onClick={() => { onModeChange('search'); inputRef.current?.focus(); }}>
          <Search size={13} /> Search web
        </button>
        <button type="button" onClick={() => { onModeChange('search'); onSearchEngineChange('youtube'); inputRef.current?.focus(); }}>
          <BrandIcon icon="youtube" size={13} /> YouTube
        </button>
        <button type="button" onClick={() => { onModeChange('search'); onSearchEngineChange('github'); inputRef.current?.focus(); }}>
          <BrandIcon icon="github" size={13} /> GitHub
        </button>
      </div>
    </section>
  );
}
