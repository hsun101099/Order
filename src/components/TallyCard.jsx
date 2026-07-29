import { motion } from 'framer-motion';
import { TONE_STYLES } from '../data/menu.js';

/**
 * 一個品項的統整：誰點了、共幾份。
 * 沒有人點的品項會淡化顯示，維持整體節奏。
 */
export default function TallyCard({ item, index = 0, unit = '份' }) {
  const Icon = item.icon;
  const tone = TONE_STYLES[item.tone] ?? TONE_STYLES.brand;
  const empty = item.count === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[20px] border p-5 transition-all duration-300 ${
        empty
          ? 'border-dashed border-slate-200 bg-white/50'
          : 'border-slate-200/70 bg-white shadow-card hover:-translate-y-0.5 hover:shadow-card-hover'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            empty ? 'bg-slate-50 text-ink-400' : tone.soft
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className={`text-base font-semibold tracking-tight ${empty ? 'text-ink-400' : 'text-ink-900'}`}>
            {item.name}
          </h3>
          <p className="text-xs text-ink-400">{item.subtitle}</p>
        </div>

        <span className="flex items-baseline gap-0.5">
          <span
            className={`text-2xl font-semibold tabular-nums ${empty ? 'text-ink-400' : 'text-ink-900'}`}
          >
            {item.count}
          </span>
          <span className="text-xs text-ink-400">{unit}</span>
        </span>
      </div>

      {empty ? (
        <p className="mt-4 text-xs text-ink-400">還沒有人點</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {item.people.map((person, personIndex) => (
            <motion.li
              key={`${person.name}-${personIndex}`}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, delay: index * 0.07 + personIndex * 0.03 }}
              className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-ink-700 ring-1 ring-inset ring-slate-200/70"
            >
              {person.name}
              {person.count > 1 && <span className="ml-1 text-ink-400">×{person.count}</span>}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
