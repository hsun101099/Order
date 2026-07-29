import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { TONE_STYLES } from '../data/menu.js';

/**
 * 餐點 / 飲料選擇卡：以份數增減取代單選，
 * 同一款可以點兩份，總份數由外層限制。
 */
export default function OptionCard({ option, quantity = 0, onChange, canAdd = true, index = 0 }) {
  const Icon = option.icon;
  const tone = TONE_STYLES[option.tone] ?? TONE_STYLES.brand;
  const selected = quantity > 0;

  const step = (delta) => {
    if (delta > 0 && !canAdd) return;
    if (delta < 0 && quantity === 0) return;
    onChange(option.id, quantity + delta);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col items-center gap-3 rounded-card border bg-white px-4 py-6 text-center transition-all duration-300 ease-out ${
        selected
          ? 'border-brand-600 shadow-card-hover ring-1 ring-brand-600'
          : 'border-slate-200/70 shadow-card hover:-translate-y-1 hover:shadow-card-hover'
      }`}
    >
      {/* 點卡片本身也能加一份，維持一按就選的手感 */}
      <button
        type="button"
        onClick={() => step(1)}
        disabled={!canAdd}
        aria-label={`${option.name} 加一份`}
        className="focus-ring absolute inset-0 rounded-card disabled:cursor-not-allowed"
      />

      <span
        className={`pointer-events-none flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 ${
          selected ? 'scale-105' : ''
        } ${tone.soft}`}
      >
        <Icon className="h-7 w-7" />
      </span>

      <h3 className="pointer-events-none text-base font-semibold tracking-tight text-ink-900">
        {option.name}
      </h3>

      {/* 份數控制：位於卡片按鈕之上，可獨立點擊 */}
      <div className="relative z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={quantity === 0}
          aria-label={`${option.name} 減一份`}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-500 transition-colors duration-200 hover:bg-slate-50 hover:text-ink-900 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span
          className={`w-8 text-center text-lg font-semibold tabular-nums ${
            selected ? 'text-ink-900' : 'text-ink-400'
          }`}
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canAdd}
          aria-label={`${option.name} 加一份`}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-white transition-colors duration-200 hover:bg-ink-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
