import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function StepIndicator({ steps, current }) {
  return (
    <ol className="flex w-full items-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
              {active && (
                <span className="absolute inset-0 rounded-full bg-brand-600/25 animate-pulse-ring" />
              )}
              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                  done
                    ? 'bg-success text-white'
                    : active
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-ink-400'
                }`}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
              </span>
            </span>

            <span className="hidden min-w-0 sm:block">
              <span
                className={`block truncate text-sm font-medium transition-colors duration-300 ${
                  active ? 'text-ink-900' : done ? 'text-ink-700' : 'text-ink-400'
                }`}
              >
                {step.label}
              </span>
            </span>

            {index < steps.length - 1 && (
              <span className="ml-1 h-px flex-1 overflow-hidden bg-slate-200">
                <motion.span
                  className="block h-full bg-success"
                  initial={{ width: 0 }}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
