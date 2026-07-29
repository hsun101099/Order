import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

const TABS = [
  { id: 'order', label: '我要點' },
  { id: 'summary', label: '大家點的' },
];

const dayFormatter = new Intl.DateTimeFormat('zh-TW', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

export default function TopBar({ page, onNavigate, count }) {
  return (
    <header className="sticky top-0 z-20 bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-900 text-white">
            <UtensilsCrossed className="h-[18px] w-[18px]" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-ink-900">點餐</span>
            <span className="block text-[11px] text-ink-400">{dayFormatter.format(new Date())}</span>
          </span>
        </div>

        <nav className="flex items-center gap-1 rounded-full bg-white p-1 shadow-card ring-1 ring-slate-200/70">
          {TABS.map((tab) => {
            const active = page === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                className="relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200"
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-ink-900"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-1.5 ${
                    active ? 'text-white' : 'text-ink-500 hover:text-ink-900'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'summary' && count > 0 && (
                    <span
                      className={`rounded-full px-1.5 text-[11px] tabular-nums ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-ink-400'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
