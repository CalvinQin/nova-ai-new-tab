import { motion } from 'framer-motion';
import { Clock3 } from 'lucide-react';
import { aiProviders, searchEngines } from '../data/catalog';
import type { BrandIconKey, QuickLink, RecentItem } from '../types';
import { BrandIcon } from './BrandIcon';
import { useI18n } from '../i18n';

interface RecentStripProps {
  recents: RecentItem[];
  quickLinks: QuickLink[];
  onOpen: (item: RecentItem) => void;
}

function recentIcon(item: RecentItem, quickLinks: QuickLink[]): BrandIconKey {
  if (item.kind === 'ai') return aiProviders[item.targetId as keyof typeof aiProviders]?.icon ?? 'website';
  if (item.kind === 'search') return searchEngines[item.targetId as keyof typeof searchEngines]?.icon ?? 'website';
  return quickLinks.find((link) => link.url.startsWith(item.safeUrl ?? 'never-match'))?.icon ?? 'website';
}

export function RecentStrip({ recents, quickLinks, onOpen }: RecentStripProps) {
  const { t } = useI18n();
  if (!recents.length) {
    return (
      <section className="recent-section is-empty" aria-labelledby="recent-title">
        <div className="section-kicker" id="recent-title">{t('section.recent')}</div>
        <p><Clock3 aria-hidden="true" size={14} /> {t('recent.empty')}</p>
      </section>
    );
  }

  return (
    <motion.section
      className="recent-section"
      aria-labelledby="recent-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.34, delay: 0.12 }}
    >
      <div className="section-kicker" id="recent-title">{t('section.recent')}</div>
      <div className="recent-list">
        {recents.slice(0, 5).map((item) => (
          <button type="button" key={item.id} onClick={() => onOpen(item)}>
            <BrandIcon icon={recentIcon(item, quickLinks)} size={13} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </motion.section>
  );
}
