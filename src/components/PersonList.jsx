import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { findDrink, findMeal } from '../data/menu.js';
import { formatRelative } from '../utils/format.js';

const AVATAR_TONES = [
  'bg-brand-50 text-brand-600',
  'bg-amber-50 text-amber-600',
  'bg-emerald-50 text-emerald-600',
  'bg-rose-50 text-rose-600',
];

/** ['soda','soda'] → '汽水 ×2' */
const describe = (ids = [], finder) => {
  const counted = ids.reduce((acc, id) => ({ ...acc, [id]: (acc[id] ?? 0) + 1 }), {});
  return Object.entries(counted)
    .map(([id, quantity]) => `${finder(id)?.name ?? id}${quantity > 1 ? ` ×${quantity}` : ''}`)
    .join('、');
};

/** 每個人點了什麼，依照點餐先後排列。 */
export default function PersonList({ orders, onRemove }) {
  return (
    <ul className="flex flex-col">
      <AnimatePresence initial={false}>
        {orders.map((order, index) => (
          <motion.li
            key={order.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="group flex items-center gap-3.5 border-b border-slate-100 py-3.5 last:border-0"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                AVATAR_TONES[index % AVATAR_TONES.length]
              }`}
            >
              {order.customerName.slice(0, 1)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <p className="truncate text-sm font-semibold text-ink-900">{order.customerName}</p>
                <span className="shrink-0 text-[11px] text-ink-400">
                  {formatRelative(order.createdAt)}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-ink-500">
                {describe(order.meals, findMeal)}
                <span className="mx-1.5 text-ink-300">·</span>
                {describe(order.drinks, findDrink)}
                {order.note && <span className="text-ink-400">（{order.note}）</span>}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRemove(order.id)}
              aria-label={`刪除 ${order.customerName} 的餐點`}
              className="focus-ring shrink-0 rounded-full p-2 text-ink-400 opacity-0 transition-all duration-200 hover:bg-rose-50 hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
