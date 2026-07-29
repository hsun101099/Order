import { Clock, CookingPot, BellRing, CheckCircle2, XCircle } from 'lucide-react';

/**
 * 訂單狀態流：待製作 → 製作中 → 可取餐 → 已完成，任何階段皆可取消。
 */
export const ORDER_STATUS = {
  pending: {
    id: 'pending',
    label: '待製作',
    icon: Clock,
    progress: 25,
    badge: 'bg-slate-100 text-ink-700 ring-1 ring-inset ring-slate-200',
    dot: 'bg-slate-400',
    bar: 'bg-slate-400',
  },
  preparing: {
    id: 'preparing',
    label: '製作中',
    icon: CookingPot,
    progress: 60,
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  ready: {
    id: 'ready',
    label: '可取餐',
    icon: BellRing,
    progress: 85,
    badge: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200',
    dot: 'bg-teal-500',
    bar: 'bg-teal-500',
  },
  completed: {
    id: 'completed',
    label: '已完成',
    icon: CheckCircle2,
    progress: 100,
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    dot: 'bg-emerald-600',
    bar: 'bg-emerald-600',
  },
  cancelled: {
    id: 'cancelled',
    label: '已取消',
    icon: XCircle,
    progress: 0,
    badge: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
  },
};

/** 正常流程順序（不含取消），用於 Timeline 與「推進下一步」。 */
export const STATUS_FLOW = ['pending', 'preparing', 'ready', 'completed'];

export const STATUS_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待製作' },
  { id: 'preparing', label: '製作中' },
  { id: 'ready', label: '可取餐' },
  { id: 'completed', label: '已完成' },
  { id: 'cancelled', label: '已取消' },
];

export const getStatus = (id) => ORDER_STATUS[id] ?? ORDER_STATUS.pending;

export const getNextStatus = (id) => {
  const index = STATUS_FLOW.indexOf(id);
  if (index === -1 || index === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[index + 1];
};
