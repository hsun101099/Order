import { motion } from 'framer-motion';

export default function ProgressBar({ value, colorClass = 'bg-brand-600', showLabel = true }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-full min-w-[72px] overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right text-[11px] font-medium tabular-nums text-ink-400">
          {clamped}%
        </span>
      )}
    </div>
  );
}
