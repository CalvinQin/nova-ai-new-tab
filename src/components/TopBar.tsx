import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Focus, FocusIcon, Settings2 } from 'lucide-react';

interface TopBarProps {
  showClock: boolean;
  focusMode: boolean;
  onToggleFocus: () => void;
  onOpenSettings: () => void;
}

function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time className="clock" dateTime={now.toISOString()}>
      <strong>{new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)}</strong>
      <span>{new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(now)}</span>
    </time>
  );
}

export function TopBar({ showClock, focusMode, onToggleFocus, onOpenSettings }: TopBarProps) {
  return (
    <motion.header
      className="top-bar"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="brand-lockup" aria-label="NOVA">
        <span className="nova-symbol" aria-hidden="true" />
        <span>NOVA</span>
      </div>
      <div className="top-actions">
        {showClock && !focusMode && <Clock />}
        <button
          type="button"
          className={focusMode ? 'icon-button is-active' : 'icon-button'}
          aria-label={focusMode ? 'Leave Focus Mode' : 'Enter Focus Mode'}
          aria-pressed={focusMode}
          onClick={onToggleFocus}
        >
          {focusMode ? <FocusIcon aria-hidden="true" size={17} /> : <Focus aria-hidden="true" size={17} />}
        </button>
        <button type="button" className="icon-button" aria-label="Open settings" onClick={onOpenSettings}>
          <Settings2 aria-hidden="true" size={17} />
        </button>
      </div>
    </motion.header>
  );
}
