import { useEffect, useState } from 'react';
import { ArrowRight, Ban, Save } from 'lucide-react';
import Drawer from './Drawer.jsx';
import Timeline from './Timeline.jsx';
import StatusBadge from './StatusBadge.jsx';
import ProgressBar from './ProgressBar.jsx';
import { findDrink, findMeal } from '../data/menu.js';
import { getNextStatus, getStatus, ORDER_STATUS } from '../data/orderStatus.js';
import { formatCurrency, formatDateTime } from '../utils/format.js';

const NOTE_PRESETS = ['顧客加點中', '等待廚房備料', '顧客尚未取餐', '飲料改為去冰'];

function InfoItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-ink-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink-900">{value}</dd>
    </div>
  );
}

export default function OrderDrawer({ order, open, onClose, onAdvance, onCancel, onSaveNote }) {
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(order?.note ?? '');
  }, [order?.id, order?.note]);

  if (!order) return null;

  const meal = findMeal(order.mealId);
  const drink = findDrink(order.drinkId);
  const status = getStatus(order.status);
  const nextStatus = getNextStatus(order.status);
  const closed = order.status === 'completed' || order.status === 'cancelled';
  const noteDirty = note.trim() !== (order.note ?? '');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={order.customerName}
      subtitle={`訂單編號 ${order.code}`}
      footer={
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            disabled={!nextStatus}
            onClick={() => onAdvance(order.id)}
            className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400 disabled:shadow-none"
          >
            <ArrowRight className="h-4 w-4" />
            {nextStatus ? `推進至「${ORDER_STATUS[nextStatus].label}」` : '流程已結束'}
          </button>
          <button
            type="button"
            disabled={closed}
            onClick={() => onCancel(order.id)}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-danger transition-all duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-ink-400 disabled:hover:bg-white"
          >
            <Ban className="h-4 w-4" />
            取消訂單
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        {/* 訂單摘要 */}
        <section className="rounded-card border border-slate-200/70 bg-slate-50/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={order.status} />
            <span className="text-xl font-semibold tabular-nums text-ink-900">
              {formatCurrency(order.total)}
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar value={status.progress} colorClass={status.bar} />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <InfoItem label="餐點" value={meal?.name ?? '—'} />
            <InfoItem label="飲料" value={drink?.name ?? '—'} />
            <InfoItem label="顧客姓名" value={order.customerName} />
            <InfoItem label="建立時間" value={formatDateTime(order.createdAt)} />
          </dl>
        </section>

        {/* 流程 Timeline */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-ink-900">訂單流程</h3>
          <Timeline order={order} />
        </section>

        {/* 備註 */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-ink-900">備註</h3>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="例如：顧客加點中、等待廚房備料…"
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-3.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all duration-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          <div className="mt-2.5 flex flex-wrap gap-2">
            {NOTE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNote(preset)}
                className="focus-ring rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-ink-500 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                {preset}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!noteDirty}
            onClick={() => onSaveNote(order.id, note.trim())}
            className="focus-ring mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-ink-400"
          >
            <Save className="h-3.5 w-3.5" />
            儲存備註
          </button>
        </section>
      </div>
    </Drawer>
  );
}
