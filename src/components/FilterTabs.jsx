import { motion } from 'framer-motion';

export default function FilterTabs({ items, value, onChange, counts = {} }) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {items.map((item) => {
        const active = value === item.id;
        const count = counts[item.id];
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`relative shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
              active ? 'text-white' : 'text-ink-500 hover:bg-slate-100 hover:text-ink-900'
            }`}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-xl bg-ink-900"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {item.label}
              {typeof count === 'number' && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${
                    active ? 'bg-white/15 text-white' : 'bg-slate-100 text-ink-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
