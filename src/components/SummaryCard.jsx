import { motion } from 'framer-motion';

const TONE = {
  brand: 'bg-brand-50 text-brand-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-ink-700',
};

export default function SummaryCard({ icon: Icon, label, value, unit, hint, tone = 'brand', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="card-interactive p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-ink-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONE[tone]}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight text-ink-900 tabular-nums">{value}</span>
        {unit && <span className="text-sm font-medium text-ink-400">{unit}</span>}
      </p>
      {hint && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
    </motion.div>
  );
}
