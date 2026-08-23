import { useState } from 'react';
import { Globe2 } from 'lucide-react';
import type { SimpleIcon } from 'simple-icons';
import {
  siAlibabadotcom,
  siBilibili,
  siBrave,
  siClaude,
  siDeepseek,
  siDuckduckgo,
  siFigma,
  siGithub,
  siGmail,
  siGoogle,
  siGoogledrive,
  siGooglegemini,
  siNotion,
  siPerplexity,
  siReddit,
  siTaobao,
  siX,
  siXiaohongshu,
  siYoutube,
  siZhihu,
} from 'simple-icons';
import type { BrandIconKey } from '../types';

const icons: Partial<Record<BrandIconKey, SimpleIcon>> = {
  claude: siClaude,
  gemini: siGooglegemini,
  perplexity: siPerplexity,
  grok: siX,
  deepseek: siDeepseek,
  google: siGoogle,
  bing: siGoogle,
  duckduckgo: siDuckduckgo,
  brave: siBrave,
  youtube: siYoutube,
  github: siGithub,
  reddit: siReddit,
  bilibili: siBilibili,
  zhihu: siZhihu,
  xiaohongshu: siXiaohongshu,
  taobao: siTaobao,
  gmail: siGmail,
  notion: siNotion,
  figma: siFigma,
  drive: siGoogledrive,
  alibaba: siAlibabadotcom,
};

interface BrandIconProps {
  icon: BrandIconKey;
  iconUrl?: string;
  size?: number;
  className?: string;
  label?: string;
}

export function BrandIcon({ icon, iconUrl, size = 20, className, label }: BrandIconProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const brand = icons[icon];

  if (iconUrl && !imageFailed) {
    return (
      <img
        className={className}
        src={iconUrl}
        alt={label ? `${label} icon` : ''}
        width={size}
        height={size}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    );
  }

  if (icon === 'chatgpt') {
    return (
      <svg
        className={className}
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.2c2.1-1.2 4.8-.45 6 1.65a4.37 4.37 0 0 1 .42 3.28 4.39 4.39 0 0 1 1.74 6.03 4.38 4.38 0 0 1-2.64 1.98 4.39 4.39 0 0 1-4.78 4.08A4.38 4.38 0 0 1 10 18.92a4.39 4.39 0 0 1-6.52-2.78 4.38 4.38 0 0 1 .9-3.16A4.39 4.39 0 0 1 5.84 6.9a4.37 4.37 0 0 1 3.22-.7A4.36 4.36 0 0 1 12 3.2Z" />
        <path d="m8.15 8.2 3.9-2.25 3.8 2.2v4.5l-3.9 2.25-3.8-2.2V8.2Zm0 4.5-2.2-1.3m6.1-5.45V3.4m3.8 9.25 2.2 1.28m-6.1.97v2.55" />
      </svg>
    );
  }

  if (icon === 'tradeflow') {
    return (
      <svg
        className={className}
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 7.2h11.7M9.2 3.5 4.5 7.2l4.7 3.7M19.5 16.8H7.8m7 3.7 4.7-3.7-4.7-3.7" />
      </svg>
    );
  }

  if (brand) {
    return (
      <svg
        className={className}
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
      >
        <path d={brand.path} />
      </svg>
    );
  }

  return <Globe2 className={className} aria-hidden="true" size={size} strokeWidth={1.7} />;
}
