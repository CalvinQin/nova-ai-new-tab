import { describe, expect, it } from 'vitest';
import { endpointOriginPattern, serverOrigins } from './server-monitor';
import type { MonitoredServer } from '../types';

const server: MonitoredServer = {
  id: 'production',
  name: 'Production',
  provider: 'baota',
  healthUrl: 'https://api.example.com/health',
  status: 'unknown',
  ports: [
    { id: 'web', name: 'Web · 443', url: 'https://app.example.com/health', status: 'unknown' },
    { id: 'api', name: 'API · 8443', url: 'https://api.example.com:8443/health', status: 'unknown' },
  ],
};

describe('server monitoring endpoint safety', () => {
  it('accepts only HTTP(S) origins and keeps an origin-specific permission pattern', () => {
    expect(endpointOriginPattern('https://api.example.com/health')).toBe('https://api.example.com/*');
    expect(endpointOriginPattern('http://localhost:8080/health')).toBe('http://localhost:8080/*');
    expect(endpointOriginPattern('javascript:alert(1)')).toBeNull();
    expect(endpointOriginPattern('not a url')).toBeNull();
  });

  it('deduplicates configured server and port origins before permission is requested', () => {
    expect(serverOrigins(server)).toEqual([
      'https://api.example.com/*',
      'https://app.example.com/*',
      'https://api.example.com:8443/*',
    ]);
  });
});
