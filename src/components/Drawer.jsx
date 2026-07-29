import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * 通用右側 Drawer：ESC 可關閉、開啟時鎖定背景捲動。
 */
export default function Drawer({ open, onClose, title, subtitle, footer, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-ink-900/25 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.section
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col bg-white shadow-drawer"
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-6 py-5">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold tracking-tight text-ink-900">{title}</h2>
                {subtitle && <p className="mt-0.5 truncate text-sm text-ink-400">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="focus-ring rounded-full p-2 text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-900"
                aria-label="關閉"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

            {footer && (
              <footer className="border-t border-slate-200/70 bg-white px-6 py-4">{footer}</footer>
            )}
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
