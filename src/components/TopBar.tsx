import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Focus, FocusIcon, Settings2 } from 'lucide-react';
import { useI18n } from '../i18n';
import type { Language } from '../types';

interface TopBarProps {
  showClock: boolean;
  focusMode: boolean;
  onToggleFocus: () => void;
  onOpenSettings: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

function Flag({ country }: { country: 'us' | 'cn' }) {
  return country === 'cn' ? (
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false"><rect width="30" height="20" fill="#de2910" /><path fill="#ffde00" d="m5 2.2.72 2.2h2.3l-1.86 1.36.71 2.2L5 6.6 3.13 7.96l.71-2.2L2 4.4h2.3L5 2.2Zm4.47 1.13.36.73.8.12-.58.57.14.8-.72-.38-.72.38.14-.8-.58-.57.8-.12.36-.73Zm1.1 3.3.36.73.8.12-.58.57.14.8-.72-.38-.72.38.14-.8-.58-.57.8-.12.36-.73Zm-1.8 2.66.36.73.8.12-.58.57.14.8-.72-.38-.72.38.14-.8-.58-.57.8-.12.36-.73Zm-3.23 1.2.36.73.8.12-.58.57.14.8-.72-.38-.72.38.14-.8-.58-.57.8-.12.36-.73Z" /></svg>
  ) : (
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false"><rect width="30" height="20" fill="#b22234" /><path stroke="#fff" strokeWidth="2" d="M0 3h30M0 7h30M0 11h30M0 15h30M0 19h30" /><rect width="13" height="11" fill="#3c3b6e" /><path fill="#fff" d="m2 2 .4 1.2h1.25l-1 .73.38 1.2L2 4.4l-1.03.74.4-1.2-1-.73h1.25L2 2Zm4 0 .4 1.2h1.25l-1 .73.38 1.2L6 4.4l-1.03.74.4-1.2-1-.73h1.25L6 2Zm4 0 .4 1.2h1.25l-1 .73.38 1.2L10 4.4l-1.03.74.4-1.2-1-.73h1.25L10 2Z" /></svg>
  );
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

export function TopBar({ showClock, focusMode, onToggleFocus, onOpenSettings, language, onLanguageChange }: TopBarProps) {
  const { t } = useI18n();
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
        <div className="language-switch" role="group" aria-label={t('language.name')}>
          <button type="button" className={language === 'en' ? 'is-active' : ''} aria-pressed={language === 'en'} aria-label={t('language.english')} onClick={() => onLanguageChange('en')}><Flag country="us" /><span>EN</span></button>
          <button type="button" className={language === 'zh-CN' ? 'is-active' : ''} aria-pressed={language === 'zh-CN'} aria-label={t('language.chinese')} onClick={() => onLanguageChange('zh-CN')}><Flag country="cn" /><span>中</span></button>
        </div>
        <button
          type="button"
          className={focusMode ? 'icon-button is-active' : 'icon-button'}
          aria-label={focusMode ? t('top.focus.leave') : t('top.focus.enter')}
          aria-pressed={focusMode}
          onClick={onToggleFocus}
        >
          {focusMode ? <FocusIcon aria-hidden="true" size={17} /> : <Focus aria-hidden="true" size={17} />}
        </button>
        <button type="button" className="icon-button" aria-label={t('top.settings')} onClick={onOpenSettings}>
          <Settings2 aria-hidden="true" size={17} />
        </button>
      </div>
    </motion.header>
  );
}
