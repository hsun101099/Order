import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TONE_STYLES } from '../data/menu.js';
import { formatCurrency } from '../utils/format.js';

export default function OptionCard({ option, selected, onSelect, index = 0, compact = false }) {
  const Icon = option.icon;
  const tone = TONE_STYLES[option.tone] ?? TONE_STYLES.brand;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(option.id)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      aria-pressed={selected}
      className={`focus-ring group relative flex w-full flex-col items-start gap-3 rounded-card border bg-white p-5 text-left transition-all duration-300 ease-out ${
        selected
          ? 'border-brand-600 shadow-card-hover ring-1 ring-brand-600'
          : 'border-slate-200/70 shadow-card hover:-translate-y-1 hover:shadow-card-hover'
      }`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${tone.soft}`}
        >
          <Icon className="h-[22px] w-[22px]" />
        </span>

        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200 ${
            selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 text-transparent'
          }`}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight text-ink-900">{option.name}</h3>
          {option.tag && !compact && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tone.soft}`}>
              {option.tag}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-400">{option.subtitle}</p>
        {!compact && (
          <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{option.description}</p>
        )}
        <p className="mt-3 text-sm font-semibold text-ink-900">{formatCurrency(option.price)}</p>
      </div>
    </motion.button>
  );
}
