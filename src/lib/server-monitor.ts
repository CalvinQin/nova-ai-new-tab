import type { HealthStatus, MonitoredServer, ServerPort } from '../types';

export const HEALTH_CHECK_TIMEOUT_MS = 8_000;

export function endpointOriginPattern(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return `${url.origin}/*`;
  } catch {
    return null;
  }
}

export function serverOrigins(server: MonitoredServer): string[] {
  return [...new Set([server.healthUrl, ...server.ports.map((port) => port.url)]
    .map(endpointOriginPattern)
    .filter((origin): origin is string => Boolean(origin)))];
}

export async function requestServerAccess(server: MonitoredServer): Promise<boolean> {
  const origins = serverOrigins(server);
  if (!origins.length || typeof chrome === 'undefined' || !chrome.permissions) return origins.length > 0;
  return chrome.permissions.request({ origins });
}

export async function hasServerAccess(server: MonitoredServer): Promise<boolean> {
  const origins = serverOrigins(server);
  if (!origins.length || typeof chrome === 'undefined' || !chrome.permissions?.contains) return origins.length > 0;
  return chrome.permissions.contains({ origins });
}

export async function checkEndpoint(url: string): Promise<Pick<ServerPort, 'status' | 'latency' | 'checkedAt'>> {
  const checkedAt = Date.now();
  if (!endpointOriginPattern(url)) return { status: 'unknown', checkedAt };
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);
  const startedAt = performance.now();
  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
    });
    const latency = Math.round(performance.now() - startedAt);
    const status: HealthStatus = response.ok ? 'healthy' : response.status < 500 ? 'degraded' : 'offline';
    return { status, latency, checkedAt };
  } catch {
    return { status: 'offline', latency: Math.round(performance.now() - startedAt), checkedAt };
  } finally {
    window.clearTimeout(timer);
  }
}

export async function checkServer(server: MonitoredServer): Promise<MonitoredServer> {
  const checking: MonitoredServer = {
    ...server,
    status: 'checking',
    ports: server.ports.map((port) => ({ ...port, status: 'checking' })),
  };
  const [serverResult, ...portResults] = await Promise.all([
    checkEndpoint(server.healthUrl),
    ...server.ports.map((port) => checkEndpoint(port.url)),
  ]);
  return {
    ...checking,
    ...serverResult,
    ports: checking.ports.map((port, index) => ({ ...port, ...portResults[index] })),
  };
}

export function statusLabel(status: HealthStatus): string {
  return ({ unknown: 'Not checked', checking: 'Checking', healthy: 'Healthy', degraded: 'Degraded', offline: 'Offline' })[status];
}
