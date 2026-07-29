import { motion } from 'framer-motion';
import { TONE_STYLES } from '../data/menu.js';

/**
 * 品項統計：一列一個品項，只呈現名稱與份數。
 * 誰點了什麼由下方的個人清單負責，這裡不重複。
 */
export default function TallyList({ title, items, unit, total }) {
  return (
    <section>
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
        <span className="text-xs text-ink-400">
          共 {total} {unit}
        </span>
      </div>

      <ul className="mt-3 rounded-[20px] border border-slate-200/70 bg-white px-5 shadow-card">
        {items.map((item, index) => {
          const Icon = item.icon;
          const tone = TONE_STYLES[item.tone] ?? TONE_STYLES.brand;
          const empty = item.count === 0;

          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 border-b border-slate-100 py-3.5 last:border-0"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  empty ? 'bg-slate-50 text-ink-400' : tone.soft
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>

              <span
                className={`min-w-0 flex-1 truncate text-sm font-medium ${
                  empty ? 'text-ink-400' : 'text-ink-900'
                }`}
              >
                {item.name}
              </span>

              <span className="flex shrink-0 items-baseline gap-1">
                <span
                  className={`text-xl font-semibold tabular-nums ${
                    empty ? 'text-ink-400' : 'text-ink-900'
                  }`}
                >
                  {item.count}
                </span>
                <span className="text-xs text-ink-400">{unit}</span>
              </span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
