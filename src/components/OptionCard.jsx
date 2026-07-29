import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { TONE_STYLES } from '../data/menu.js';

/**
 * 餐點 / 飲料選擇卡：以份數增減取代單選，
 * 同一款可以點兩份，但總份數由外層限制。
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
      className={`relative flex flex-col gap-3 rounded-card border bg-white p-5 transition-all duration-300 ease-out ${
        selected
          ? 'border-brand-600 shadow-card-hover ring-1 ring-brand-600'
          : 'border-slate-200/70 shadow-card hover:-translate-y-1 hover:shadow-card-hover'
      }`}
    >
      {/* 點卡片本身也能加一份，維持原本一按就選的手感 */}
      <button
        type="button"
        onClick={() => step(1)}
        disabled={!canAdd}
        aria-label={`${option.name} 加一份`}
        className="focus-ring absolute inset-0 rounded-card disabled:cursor-not-allowed"
      />

      <div className="pointer-events-none flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.soft}`}
        >
          <Icon className="h-[22px] w-[22px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-ink-900">{option.name}</h3>
            {option.tag && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tone.soft}`}>
                {option.tag}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-400">{option.subtitle}</p>
        </div>
      </div>

      <p className="pointer-events-none text-sm leading-relaxed text-ink-500">{option.description}</p>

      {/* 份數控制：位於卡片按鈕之上，可獨立點擊 */}
      <div className="relative z-10 mt-1 flex items-center justify-between">
        <span className={`text-xs ${selected ? 'text-brand-700' : 'text-ink-400'}`}>
          {selected ? `已選 ${quantity} 份` : '尚未選'}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={quantity === 0}
            aria-label={`${option.name} 減一份`}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-500 transition-colors duration-200 hover:bg-slate-50 hover:text-ink-900 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span className="w-7 text-center text-sm font-semibold tabular-nums text-ink-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canAdd}
            aria-label={`${option.name} 加一份`}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-white transition-colors duration-200 hover:bg-ink-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
