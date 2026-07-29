import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, XCircle } from 'lucide-react';
import { ORDER_STATUS, STATUS_FLOW } from '../data/orderStatus.js';
import { formatDateTime } from '../utils/format.js';

const STEP_DETAIL = {
  pending: { operator: '線上自助點餐', hint: '訂單已成立，等待廚房接單。' },
  preparing: { operator: '廚房 · 阿豪', hint: '主餐開始烹調，飲料同步備製。' },
  ready: { operator: '出餐台 · 小美', hint: '餐點完成，等待顧客取餐。' },
  completed: { operator: '櫃檯 · 王小明', hint: '顧客已取餐，訂單結案。' },
};

function StepNode({ state }) {
  if (state === 'done') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-white">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    );
  }
  if (state === 'current') {
    return (
      <span className="relative flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-brand-600/30 animate-pulse-ring" />
        <span className="relative h-7 w-7 rounded-full border-[3px] border-brand-600 bg-white" />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center">
      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
    </span>
  );
}

export default function Timeline({ order }) {
  const [expanded, setExpanded] = useState(order.status);
  const cancelled = order.status === 'cancelled';
  const finished = order.status === 'completed';
  const currentIndex = cancelled ? -1 : STATUS_FLOW.indexOf(order.status);

  return (
    <div className="flex flex-col">
      {STATUS_FLOW.map((statusId, index) => {
        const config = ORDER_STATUS[statusId];
        const detail = STEP_DETAIL[statusId];
        // 已完成的訂單所有節點皆為完成狀態；已取消則只保留「待製作」。
        const state = cancelled
          ? index === 0
            ? 'done'
            : 'todo'
          : finished || index < currentIndex
            ? 'done'
            : index === currentIndex
              ? 'current'
              : 'todo';
        const open = expanded === statusId;
        const reached = state !== 'todo';

        return (
          <div key={statusId} className="relative flex gap-3.5 pb-1">
            <div className="flex flex-col items-center">
              <StepNode state={state} />
              {index < STATUS_FLOW.length - 1 && (
                <span
                  className={`w-px flex-1 ${state === 'done' ? 'bg-success/40' : 'bg-slate-200'}`}
                />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-5">
              <button
                type="button"
                onClick={() => setExpanded(open ? null : statusId)}
                className="focus-ring group flex w-full items-center justify-between gap-3 rounded-xl px-1 py-0.5 text-left"
              >
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-semibold ${reached ? 'text-ink-900' : 'text-ink-400'}`}
                  >
                    {config.label}
                  </span>
                  <span className="block text-xs text-ink-400">
                    {reached ? formatDateTime(index === 0 ? order.createdAt : order.updatedAt) : '尚未進行'}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-ink-400 transition-transform duration-300 ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <dl className="mt-2.5 grid grid-cols-3 gap-y-2.5 rounded-2xl bg-slate-50 p-3.5 text-xs">
                      <dt className="col-span-1 text-ink-400">負責人</dt>
                      <dd className="col-span-2 text-ink-700">{detail.operator}</dd>
                      <dt className="col-span-1 text-ink-400">說明</dt>
                      <dd className="col-span-2 leading-relaxed text-ink-700">{detail.hint}</dd>
                      <dt className="col-span-1 text-ink-400">備註</dt>
                      <dd className="col-span-2 text-ink-700">
                        {statusId === 'pending' && order.note ? order.note : '—'}
                      </dd>
                    </dl>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {cancelled && (
        <div className="flex gap-3.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-danger text-white">
            <XCircle className="h-4 w-4" />
          </span>
          <div className="pt-0.5">
            <p className="text-sm font-semibold text-danger">已取消</p>
            <p className="text-xs text-ink-400">{formatDateTime(order.updatedAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
