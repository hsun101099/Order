import { motion } from 'framer-motion';

/**
 * 輕量圖表元件組：不引入額外圖表函式庫，
 * 以 SVG / CSS 呈現，確保載入速度與視覺一致性。
 */

export function BarChart({ data, valueSuffix = ' 份' }) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <div key={item.id} className="group">
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-ink-700">{item.label}</span>
            <span className="text-xs tabular-nums text-ink-400">
              {item.value}
              {valueSuffix}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className={`h-full rounded-full ${item.colorClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ data, centerLabel, centerValue }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="16" />
          {data.map((item) => {
            const fraction = item.value / total;
            const dash = fraction * circumference;
            const circle = (
              <motion.circle
                key={item.id}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: -offset }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-ink-900">{centerValue}</span>
          <span className="text-xs text-ink-400">{centerLabel}</span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-3 sm:w-40">
        {data.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-700">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <span className="tabular-nums text-ink-400">
              {Math.round((item.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendChart({ data }) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="flex h-44 items-end gap-2 sm:gap-3">
      {data.map((item, index) => (
        <div key={item.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-[11px] font-medium tabular-nums text-ink-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {item.value}
          </span>
          <motion.div
            className="w-full rounded-t-lg bg-gradient-to-t from-brand-100 to-brand-500 transition-colors duration-300 group-hover:to-brand-600"
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(4, (item.value / max) * 100)}%` }}
            transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="text-[11px] text-ink-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
