import { RefreshCw, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { serverProviders } from '../data/catalog';
import { useI18n } from '../i18n';
import type { HealthStatus, ServerMonitorSettings } from '../types';
import { ServerVendorLogo } from './ServerVendorLogo';

interface ServerStatusPanelProps {
  monitor: ServerMonitorSettings;
  refreshingServerIds: string[];
  onRefresh: (serverId: string) => void;
  onConfigure: () => void;
}

function formatCheckedAt(value: number | undefined, language: 'en' | 'zh-CN') {
  if (!value) return language === 'zh-CN' ? '尚未检测' : 'Not checked yet';
  return new Intl.DateTimeFormat(language === 'zh-CN' ? 'zh-CN' : 'en', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(value);
}

function statusKey(status: HealthStatus) {
  return `status.${status}` as const;
}

export function ServerStatusPanel({ monitor, refreshingServerIds, onRefresh, onConfigure }: ServerStatusPanelProps) {
  const { t, language } = useI18n();
  const servers = monitor.servers.slice(0, 2);
  if (!monitor.enabled) return null;

  return (
    <motion.section
      className={servers.length ? 'system-pulse' : 'system-pulse is-empty'}
      aria-labelledby="system-pulse-title"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="system-pulse-header">
        <div>
          <span className="system-pulse-kicker">{t('status.kicker')}</span>
          <h2 id="system-pulse-title">{t('status.title')}</h2>
        </div>
        <button type="button" className="system-pulse-configure" onClick={onConfigure}>
          <Settings2 aria-hidden="true" size={14} /> {t('status.configure')}
        </button>
      </header>

      {servers.length ? (
        <div className="server-rail" aria-live="polite">
          {servers.map((server) => {
            const vendor = serverProviders.find((provider) => provider.id === server.provider);
            const refreshing = refreshingServerIds.includes(server.id);
            return (
              <article className="server-pulse" key={server.id}>
                <div className="server-pulse-heading">
                  <span className="server-vendor-mark" style={{ color: vendor?.color }}><ServerVendorLogo provider={server.provider} size={19} /></span>
                  <div>
                    <strong>{server.name || t('status.unnamed')}</strong>
                    <span>{vendor?.name ?? 'Custom'}</span>
                  </div>
                  <span className={`health-state health-${server.status}`}>
                    <i aria-hidden="true" />{t(statusKey(server.status))}
                  </span>
                </div>
                <div className="server-pulse-details">
                  <span>{server.latency !== undefined ? `${server.latency} ms` : t('status.noLatency')}</span>
                  <span>{formatCheckedAt(server.checkedAt, language)}</span>
                  <button type="button" className={refreshing ? 'server-refresh is-refreshing' : 'server-refresh'} aria-label={t('status.refreshServer', { name: server.name || t('status.unnamed') })} disabled={refreshing} onClick={() => onRefresh(server.id)}>
                    <RefreshCw aria-hidden="true" size={14} />
                  </button>
                </div>
                <div className="port-rail" aria-label={t('status.portsFor', { name: server.name || t('status.unnamed') })}>
                  {server.ports.length ? server.ports.slice(0, 3).map((port) => (
                    <span className={`port-signal health-${port.status}`} key={port.id}>
                      <i aria-hidden="true" />
                      <strong>{port.name}</strong>
                      <small>{port.latency !== undefined ? `${port.latency} ms` : t(statusKey(port.status))}</small>
                    </span>
                  )) : <span className="port-empty">{t('status.noPorts')}</span>}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="system-pulse-empty-copy">
          <span className="health-state health-unknown"><i aria-hidden="true" />{t('status.notLinked')}</span>
          <p>{t('status.empty')}</p>
        </div>
      )}
    </motion.section>
  );
}
