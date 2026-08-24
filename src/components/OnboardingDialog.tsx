import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { aiProviders, searchEngines } from '../data/catalog';
import type { AiProviderId, Mode, NovaSettings, SearchEngineId } from '../types';
import { BrandIcon } from './BrandIcon';
import { useI18n } from '../i18n';

interface OnboardingDialogProps {
  settings: NovaSettings;
  onUpdate: (settings: Partial<NovaSettings>) => void;
  onComplete: () => void;
}

export function OnboardingDialog({ settings, onUpdate, onComplete }: OnboardingDialogProps) {
  const { language, t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);

  const openDialog = (node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    if (node && !node.open) node.showModal();
  };

  const finish = () => {
    dialogRef.current?.close();
    onComplete();
  };

  return (
    <dialog
      ref={openDialog}
      className="nova-dialog onboarding-dialog"
      aria-labelledby="onboarding-title"
      onCancel={(event) => event.preventDefault()}
    >
      <motion.div
        className="dialog-surface onboarding-surface"
        initial={{ opacity: 0, y: 18, scale: 0.98, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="onboarding-header">
          <span className="nova-symbol onboarding-symbol" />
          <div className="onboarding-progress" aria-label={t('onboard.step', { step: step + 1 })}>
            {[0, 1, 2].map((item) => <span key={item} className={step === item ? 'is-active' : step > item ? 'is-done' : ''} />)}
          </div>
          <div className="onboarding-language-switch" role="group" aria-label={t('language.name')}>
            <button type="button" className={language === 'en' ? 'is-active' : ''} aria-pressed={language === 'en'} onClick={() => onUpdate({ language: 'en' })}>EN</button>
            <button type="button" className={language === 'zh-CN' ? 'is-active' : ''} aria-pressed={language === 'zh-CN'} onClick={() => onUpdate({ language: 'zh-CN' })}>中</button>
          </div>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="onboarding-body"
            key={step}
            initial={{ opacity: 0, x: 12, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -9, filter: 'blur(4px)' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <>
                <span className="dialog-eyebrow">{t('onboard.welcome')}</span>
                <h2 id="onboarding-title">{t('onboard.begin.title')}</h2>
                <p>{t('onboard.begin.desc')}</p>
                <div className="onboarding-choice two-up" role="radiogroup" aria-label={t('settings.defaultMode')}>
                  {([
                    { id: 'ai' as Mode, title: t('onboard.ask.title'), description: t('onboard.ask.desc') },
                    { id: 'search' as Mode, title: t('onboard.search.title'), description: t('onboard.search.desc') },
                  ]).map((option) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={settings.defaultMode === option.id}
                      className={settings.defaultMode === option.id ? 'onboarding-option is-selected' : 'onboarding-option'}
                      key={option.id}
                      onClick={() => onUpdate({ defaultMode: option.id })}
                    >
                      <span className="choice-orbit" aria-hidden="true"><span /></span>
                      <strong>{option.title}</strong>
                      <small>{option.description}</small>
                      {settings.defaultMode === option.id && <Check className="choice-check" size={15} />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <span className="dialog-eyebrow">{t('onboard.ai.eyebrow')}</span>
                <h2 id="onboarding-title">{t('onboard.ai.title')}</h2>
                <p>{t('onboard.ai.desc')}</p>
                <div className="onboarding-choice provider-choice" role="radiogroup" aria-label={t('settings.ai.title')}>
                  {Object.values(aiProviders).map((provider) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={settings.aiProvider === provider.id}
                      className={settings.aiProvider === provider.id ? 'onboarding-option provider-option is-selected' : 'onboarding-option provider-option'}
                      key={provider.id}
                      onClick={() => onUpdate({ aiProvider: provider.id as AiProviderId })}
                    >
                      <BrandIcon icon={provider.icon} size={20} />
                      <strong>{provider.name}</strong>
                      {settings.aiProvider === provider.id && <Check className="choice-check" size={15} />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <span className="dialog-eyebrow">{t('onboard.web.eyebrow')}</span>
                <h2 id="onboarding-title">{t('onboard.web.title')}</h2>
                <p>{t('onboard.web.desc')}</p>
                <div className="onboarding-choice provider-choice" role="radiogroup" aria-label={t('settings.search.title')}>
                  {Object.values(searchEngines).slice(0, 6).map((engine) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={settings.searchEngine === engine.id}
                      className={settings.searchEngine === engine.id ? 'onboarding-option provider-option is-selected' : 'onboarding-option provider-option'}
                      key={engine.id}
                      onClick={() => onUpdate({ searchEngine: engine.id as SearchEngineId })}
                    >
                      <BrandIcon icon={engine.icon} size={19} />
                      <strong>{engine.name}</strong>
                      {settings.searchEngine === engine.id && <Check className="choice-check" size={15} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <footer className="onboarding-actions">
          <span>{step + 1} / 3</span>
          {step > 0 && <button type="button" className="quiet-button" onClick={() => setStep((current) => current - 1)}>{t('onboard.back')}</button>}
          <button
            type="button"
            className="primary-button"
            onClick={() => (step < 2 ? setStep((current) => current + 1) : finish())}
          >
            {step < 2 ? <>{t('onboard.continue')} <ArrowRight aria-hidden="true" size={15} /></> : <>{t('onboard.ready')} <Check aria-hidden="true" size={15} /></>}
          </button>
        </footer>
      </motion.div>
    </dialog>
  );
}
