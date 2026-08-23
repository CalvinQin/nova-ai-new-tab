import { type FormEvent, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Link2, Trash2, X } from 'lucide-react';
import { normalizeShortcutUrl, shortcutMeta } from '../lib/shortcut';
import type { QuickLink } from '../types';
import { BrandIcon } from './BrandIcon';

interface ShortcutDialogProps {
  link?: QuickLink;
  onClose: () => void;
  onSave: (link: QuickLink) => void;
  onDelete?: (link: QuickLink) => void;
}

interface FormErrors {
  name?: string;
  url?: string;
  iconUrl?: string;
}

function validateField(field: keyof FormErrors, value: string): string | undefined {
  if (field === 'name') {
    if (!value.trim()) return 'Please enter a name.';
    if (value.trim().length > 24) return 'Keep the name to 24 characters or fewer.';
  }
  if (field === 'url' && !normalizeShortcutUrl(value)) {
    return 'Enter a valid website address, such as github.com.';
  }
  if (field === 'iconUrl' && value.trim()) {
    try {
      const icon = new URL(value.trim());
      if (!['http:', 'https:'].includes(icon.protocol)) throw new Error('Unsupported protocol');
    } catch {
      return 'Enter a valid HTTP or HTTPS image address.';
    }
  }
  return undefined;
}

export function ShortcutDialog({ link, onClose, onSave, onDelete }: ShortcutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(link?.name ?? '');
  const [url, setUrl] = useState(link?.url ?? '');
  const [iconUrl, setIconUrl] = useState(link?.iconUrl ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  const openDialog = (node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    if (node && !node.open) {
      node.showModal();
      requestAnimationFrame(() => (link ? nameRef.current : urlRef.current)?.focus());
    }
  };

  const validate = (field: keyof FormErrors, value: string) => {
    const error = validateField(field, value);
    setErrors((current) => ({ ...current, [field]: error }));
    return error;
  };

  const handleUrlBlur = () => {
    const error = validate('url', url);
    if (error) return;
    const meta = shortcutMeta(url);
    if (!meta) return;
    if (!name.trim()) {
      setName(meta.name);
      setErrors((current) => ({ ...current, name: undefined }));
    }
    if (!iconUrl.trim()) {
      setIconUrl(meta.iconUrl);
      setErrors((current) => ({ ...current, iconUrl: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: FormErrors = {
      name: validateField('name', name),
      url: validateField('url', url),
      iconUrl: validateField('iconUrl', iconUrl),
    };
    setErrors(nextErrors);

    const firstError = (['url', 'name', 'iconUrl'] as const).find((field) => nextErrors[field]);
    if (firstError) {
      const refs = { name: nameRef, url: urlRef, iconUrl: iconRef };
      refs[firstError].current?.focus();
      refs[firstError].current?.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(4px)' },
          { transform: 'translateX(0)' },
        ],
        { duration: 180, easing: 'ease-out' },
      );
      return;
    }

    const normalized = normalizeShortcutUrl(url)!;
    const meta = shortcutMeta(normalized);
    onSave({
      id: link?.id ?? crypto.randomUUID(),
      name: name.trim(),
      url: normalized,
      icon: meta?.icon ?? link?.icon ?? 'website',
      iconUrl: iconUrl.trim() || meta?.iconUrl,
      brandColor: link?.brandColor,
    });
  };

  const previewMeta = shortcutMeta(url);

  return (
    <dialog
      ref={openDialog}
      className="nova-dialog shortcut-dialog"
      aria-labelledby="shortcut-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <motion.div
        className="dialog-surface compact-dialog"
        initial={{ opacity: 0, y: 14, scale: 0.98, filter: 'blur(7px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="dialog-header">
          <div>
            <span className="dialog-eyebrow">Quick links</span>
            <h2 id="shortcut-dialog-title">{link ? 'Edit destination' : 'Add a destination'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close shortcut editor">
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <form className="shortcut-form" noValidate onSubmit={handleSubmit}>
          <div className="shortcut-preview" aria-hidden="true">
            <span className="shortcut-preview-icon">
              {previewMeta ? (
                <BrandIcon
                  icon={previewMeta.icon}
                  iconUrl={iconUrl || previewMeta.iconUrl}
                  size={24}
                />
              ) : (
                <Globe2 size={24} strokeWidth={1.5} />
              )}
            </span>
            <div>
              <strong>{name.trim() || previewMeta?.name || 'New shortcut'}</strong>
              <span>{normalizeShortcutUrl(url) ? new URL(normalizeShortcutUrl(url)!).hostname : 'Website address'}</span>
            </div>
          </div>

          <div className={errors.url ? 'field has-error' : 'field'}>
            <label htmlFor="shortcut-url">Website address</label>
            <div className="field-control">
              <Link2 aria-hidden="true" size={17} />
              <input
                ref={urlRef}
                id="shortcut-url"
                value={url}
                inputMode="url"
                placeholder="github.com"
                aria-invalid={Boolean(errors.url)}
                aria-describedby={errors.url ? 'shortcut-url-error' : undefined}
                onChange={(event) => {
                  const next = event.target.value;
                  setUrl(next);
                  if (errors.url) {
                    setErrors((current) => ({ ...current, url: validateField('url', next) }));
                  }
                }}
                onBlur={handleUrlBlur}
              />
            </div>
            {errors.url && <p className="field-error" id="shortcut-url-error">{errors.url}</p>}
          </div>

          <div className={errors.name ? 'field has-error' : 'field'}>
            <label htmlFor="shortcut-name">Name</label>
            <div className="field-control">
              <input
                ref={nameRef}
                id="shortcut-name"
                value={name}
                placeholder="GitHub"
                maxLength={24}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'shortcut-name-error' : undefined}
                onChange={(event) => {
                  const next = event.target.value;
                  setName(next);
                  if (errors.name) {
                    setErrors((current) => ({ ...current, name: validateField('name', next) }));
                  }
                }}
                onBlur={() => validate('name', name)}
              />
            </div>
            {errors.name && <p className="field-error" id="shortcut-name-error">{errors.name}</p>}
          </div>

          <div className={errors.iconUrl ? 'field has-error' : 'field'}>
            <div className="field-label-row">
              <label htmlFor="shortcut-icon">Icon address</label>
              <span>Optional</span>
            </div>
            <div className="field-control">
              <input
                ref={iconRef}
                id="shortcut-icon"
                value={iconUrl}
                inputMode="url"
                placeholder="Auto-detected from the website"
                aria-invalid={Boolean(errors.iconUrl)}
                aria-describedby={errors.iconUrl ? 'shortcut-icon-error' : 'shortcut-icon-hint'}
                onChange={(event) => {
                  const next = event.target.value;
                  setIconUrl(next);
                  if (errors.iconUrl) {
                    setErrors((current) => ({ ...current, iconUrl: validateField('iconUrl', next) }));
                  }
                }}
                onBlur={() => validate('iconUrl', iconUrl)}
              />
            </div>
            {errors.iconUrl ? (
              <p className="field-error" id="shortcut-icon-error">{errors.iconUrl}</p>
            ) : (
              <p className="field-hint" id="shortcut-icon-hint">NOVA tries the site's own favicon first.</p>
            )}
          </div>

          <footer className="dialog-actions">
            {link && onDelete ? (
              <button type="button" className="danger-button" onClick={() => onDelete(link)}>
                <Trash2 aria-hidden="true" size={15} /> Delete shortcut
              </button>
            ) : <span />}
            <div className="action-group">
              <button type="button" className="quiet-button" onClick={onClose}>Keep editing</button>
              <button type="submit" className="primary-button">{link ? 'Save changes' : 'Add shortcut'}</button>
            </div>
          </footer>
        </form>
      </motion.div>
    </dialog>
  );
}
