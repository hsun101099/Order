import { motion } from 'framer-motion';
import { Plus, Soup } from 'lucide-react';

/** 還沒有人點餐時共用的畫面。 */
export default function EmptyState({ onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-[24px] border border-dashed border-slate-200 bg-white/60 px-6 py-20 text-center"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-ink-400">
        <Soup className="h-6 w-6" />
      </span>
      <p className="mt-4 text-base font-semibold text-ink-900">還沒有人點餐</p>
      <p className="mt-1 text-sm text-ink-400">當第一個開始的人吧。</p>
      <button
        type="button"
        onClick={() => onNavigate('order')}
        className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
      >
        <Plus className="h-4 w-4" />
        我要點
      </button>
    </motion.div>
  );
}
