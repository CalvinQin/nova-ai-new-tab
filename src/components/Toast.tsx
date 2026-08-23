import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface ToastState {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Toast({ toast }: { toast: ToastState | null }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="toast"
          role="status"
          aria-live="polite"
          key={toast.id}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <CheckCircle2 aria-hidden="true" size={16} />
          <span>{toast.message}</span>
          {toast.actionLabel && toast.onAction && (
            <button type="button" onClick={toast.onAction}>{toast.actionLabel}</button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
