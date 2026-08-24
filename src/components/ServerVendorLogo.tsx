import { Cloud, ServerCog } from 'lucide-react';
import type { SimpleIcon } from 'simple-icons';
import { siAlibabacloud, siCloudflare, siDigitalocean, siVercel } from 'simple-icons';
import type { ServerProvider } from '../types';

const providerIcons: Partial<Record<ServerProvider, SimpleIcon>> = {
  'cloudflare': siCloudflare,
  'alibaba-cloud': siAlibabacloud,
  digitalocean: siDigitalocean,
  vercel: siVercel,
};

export function ServerVendorLogo({ provider, size = 20 }: { provider: ServerProvider; size?: number }) {
  const icon = providerIcons[provider];
  if (icon) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d={icon.path} />
      </svg>
    );
  }
  if (provider === 'baota') return <ServerCog aria-hidden="true" size={size} strokeWidth={1.65} />;
  return <Cloud aria-hidden="true" size={size} strokeWidth={1.65} />;
}
