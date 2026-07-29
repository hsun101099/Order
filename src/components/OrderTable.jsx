import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import ProgressBar from './ProgressBar.jsx';
import { findDrink, findMeal } from '../data/menu.js';
import { getStatus } from '../data/orderStatus.js';
import { formatCurrency, formatDateTime, formatRelative } from '../utils/format.js';

/** 超過此分鐘數仍未完成的訂單會被標記為等候過久。 */
export const DELAY_THRESHOLD_MINUTES = 20;

export const isDelayed = (order, now = Date.now()) => {
  if (order.status === 'completed' || order.status === 'cancelled') return false;
  return (now - new Date(order.createdAt).getTime()) / 60000 > DELAY_THRESHOLD_MINUTES;
};

function DelayTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-danger ring-1 ring-inset ring-rose-200">
      <AlertTriangle className="h-3 w-3" />
      等候逾 {DELAY_THRESHOLD_MINUTES} 分
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-ink-400">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-ink-700">找不到符合條件的訂單</p>
      <p className="text-xs text-ink-400">試著更換關鍵字或切換篩選條件。</p>
    </div>
  );
}

export default function OrderTable({ orders, onSelect }) {
  if (orders.length === 0) {
    return (
      <div className="card overflow-hidden">
        <EmptyState />
      </div>
    );
  }

  const now = Date.now();

  return (
    <div className="card overflow-hidden">
      {/* 桌機表格 */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[920px] text-left">
          <thead>
            <tr className="border-b border-slate-200/70 bg-slate-50/60">
              {['訂單編號', '顧客姓名', '餐點', '飲料', '金額', '建立時間', '進度', '狀態', ''].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const meal = findMeal(order.mealId);
              const drink = findDrink(order.drinkId);
              const status = getStatus(order.status);
              const delayed = isDelayed(order, now);

              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.3) }}
                  onClick={() => onSelect(order)}
                  className={`group cursor-pointer border-b border-slate-100 transition-colors duration-200 last:border-0 ${
                    delayed ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-medium text-ink-500">{order.code}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-ink-700">
                        {order.customerName.slice(0, 1)}
                      </span>
                      <div>
                        <span className="block text-sm font-medium text-ink-900">
                          {order.customerName}
                        </span>
                        {delayed && (
                          <span className="mt-0.5 block">
                            <DelayTag />
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-700">{meal?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-ink-700">{drink?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-sm font-medium tabular-nums text-ink-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="block text-sm text-ink-700">{formatDateTime(order.createdAt)}</span>
                    <span className="block text-xs text-ink-400">{formatRelative(order.createdAt, now)}</span>
                  </td>
                  <td className="w-40 px-5 py-4">
                    <ProgressBar value={status.progress} colorClass={status.bar} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ChevronRight className="ml-auto h-4 w-4 text-ink-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink-700" />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 手機卡片列表 */}
      <ul className="divide-y divide-slate-100 lg:hidden">
        {orders.map((order) => {
          const meal = findMeal(order.mealId);
          const drink = findDrink(order.drinkId);
          const status = getStatus(order.status);
          const delayed = isDelayed(order, now);

          return (
            <li key={order.id}>
              <button
                type="button"
                onClick={() => onSelect(order)}
                className={`focus-ring w-full px-5 py-4 text-left transition-colors ${
                  delayed ? 'bg-rose-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{order.customerName}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-ink-400">{order.code}</p>
                  </div>
                  <StatusBadge status={order.status} size="sm" />
                </div>
                <p className="mt-2 text-sm text-ink-500">
                  {meal?.name} · {drink?.name} · {formatCurrency(order.total)}
                </p>
                <div className="mt-3">
                  <ProgressBar value={status.progress} colorClass={status.bar} />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-ink-400">{formatRelative(order.createdAt, now)}</span>
                  {delayed && <DelayTag />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
