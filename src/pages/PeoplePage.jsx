import { RotateCcw } from 'lucide-react';
import PersonList from '../components/PersonList.jsx';
import EmptyState from '../components/EmptyState.jsx';

/** 大家點的：單純列出每個人點了什麼。統計在另一個分頁。 */
export default function PeoplePage({ orders, ownedIds, onRemove, onReset, onNavigate }) {
  if (orders.length === 0) {
    return <EmptyState onNavigate={onNavigate} />;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-sm font-semibold text-ink-900">每個人點的</h2>
          <p className="mt-0.5 text-[11px] text-ink-400">標示「你」的才能刪除</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="focus-ring inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          重來一輪
        </button>
      </div>

      <div className="rounded-[20px] border border-slate-200/70 bg-white px-5 py-1 shadow-card">
        <PersonList orders={orders} ownedIds={ownedIds} onRemove={onRemove} />
      </div>
    </section>
  );
}
