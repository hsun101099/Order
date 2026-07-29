import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function Toast({ toast, onDismiss, duration = 3200 }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss, duration]);

  const Icon = toast?.tone === 'info' ? Info : CheckCircle2;
  const iconColor = toast?.tone === 'info' ? 'text-brand-600' : 'text-success';

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="fixed bottom-6 left-1/2 z-[60] flex w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 items-start gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-card-hover"
        >
          <Icon className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${iconColor}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink-900">{toast.title}</p>
            {toast.description && <p className="mt-0.5 text-xs text-ink-500">{toast.description}</p>}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="focus-ring rounded-full p-1 text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-700"
            aria-label="關閉通知"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
