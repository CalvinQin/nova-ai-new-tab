import { useState } from 'react';
import { Globe2 } from 'lucide-react';
import type { SimpleIcon } from 'simple-icons';
import {
  siAlibabadotcom,
  siBaidu,
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
  siKimi,
  siNotion,
  siPerplexity,
  siReddit,
  siTaobao,
  siQwen,
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
  kimi: siKimi,
  qwen: siQwen,
  google: siGoogle,
  baidu: siBaidu,
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

  if (icon === 'doubao') {
    return (
      <svg className={className} aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.2 6.1c1.7-2.2 5.8-2.2 7.4 0 2.2-.6 4.3 1.1 4 3.5 1.7 1.6 1.2 4.5-.9 5.4-.4 2.5-3.2 3.7-5.2 2.4-2 1.3-4.8.1-5.2-2.4-2.1-.9-2.6-3.8-.9-5.4-.3-2.4 1.8-4.1 4-3.5Z" />
        <path d="M9.2 11.2h.01M14.8 11.2h.01M9.3 14.1c1.7 1.1 3.7 1.1 5.4 0" />
      </svg>
    );
  }

  if (icon === 'yuanbao') {
    return (
      <svg className={className} aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5 19 7.4v9.2L12 20.5 5 16.6V7.4L12 3.5Z" />
        <path d="m8.5 10.2 3.5-2 3.5 2v4l-3.5 2-3.5-2v-4Z" />
      </svg>
    );
  }

  if (icon === 'bing') {
    return (
      <svg
        className={className}
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
      >
        <path d="M5.6 2.5v14.7l5.35 3.08 7.45-4.3v-4.66l-5.28-3.05 1.92 4.54-4.13 2.38V5.65L5.6 2.5Z" />
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
