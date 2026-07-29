import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Cloud,
  CloudOff,
  Copy,
  Download,
  HardDrive,
  Loader2,
  Plus,
  RotateCcw,
  Soup,
} from 'lucide-react';
import TallyList from '../components/TallyList.jsx';
import PersonList from '../components/PersonList.jsx';
import { PORTIONS_PER_PERSON } from '../data/menu.js';
import { exportOrdersPdf } from '../utils/exportPdf.js';

/** 產出可直接貼到群組的文字版統整。 */
const buildShareText = (tally) => {
  const line = (items, unit) =>
    items
      .filter((item) => item.count > 0)
      .map((item) => `${item.name} ${item.count}${unit}`)
      .join('、');

  return [
    `今天 ${tally.people} 個人，共 ${tally.portions} 份`,
    `餐點：${line(tally.meals, '份') || '尚未有人點餐'}`,
    `飲料：${line(tally.drinks, '杯') || '尚未有人點飲料'}`,
  ].join('\n');
};

function EmptyState({ onNavigate }) {
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

export default function SummaryPage({
  orders,
  tally,
  source,
  offline,
  onRemove,
  onReset,
  onNavigate,
  onNotify,
}) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const filename = await exportOrdersPdf({ orders, tally });
      if (filename) onNotify?.({ title: 'PDF 已下載', description: filename });
    } catch {
      onNotify?.({ title: 'PDF 匯出失敗', description: '請稍後再試一次。', tone: 'info' });
    } finally {
      setExporting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(tally));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 瀏覽器不允許剪貼簿時靜默略過。 */
    }
  };

  if (orders.length === 0) {
    return <EmptyState onNavigate={onNavigate} />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 一行帶過的總覽 */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm text-ink-500">
          <span className="text-base font-semibold text-ink-900">{tally.people}</span> 個人，共{' '}
          <span className="text-base font-semibold text-ink-900">{tally.portions}</span> 份
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-700 transition-colors duration-200 hover:bg-slate-50"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? '已複製' : '複製統計'}
        </button>
      </div>

      {/* 統計 */}
      <TallyList title="餐點" items={tally.meals} unit="份" total={tally.portions} />
      <TallyList title="飲料" items={tally.drinks} unit="杯" total={tally.portions} />

      {/* 每個人點了什麼 */}
      <section>
        <div className="flex items-center justify-between gap-3 px-1">
          <h2 className="text-sm font-semibold text-ink-900">每個人點的</h2>
          <button
            type="button"
            onClick={onReset}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重來一輪
          </button>
        </div>

        <div className="mt-3 rounded-[20px] border border-slate-200/70 bg-white px-5 py-1 shadow-card">
          <PersonList orders={orders} onRemove={onRemove} />
        </div>
      </section>

      {/* 匯出與資料來源 */}
      <section className="flex flex-col items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={exporting}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink-700 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover disabled:cursor-wait disabled:text-ink-400"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {exporting ? '產生中…' : '下載 PDF'}
        </button>

        <p className="flex items-center gap-1.5 text-[11px] text-ink-400">
          {source === 'firebase' && !offline ? (
            <>
              <Cloud className="h-3.5 w-3.5 text-success" />
              已連線 Firebase，大家的點餐即時同步
            </>
          ) : source === 'firebase' ? (
            <>
              <CloudOff className="h-3.5 w-3.5 text-amber-500" />
              目前離線，恢復連線後會自動同步
            </>
          ) : (
            <>
              <HardDrive className="h-3.5 w-3.5" />
              目前存在這台瀏覽器，一人 {PORTIONS_PER_PERSON} 份
            </>
          )}
        </p>
      </section>
    </div>
  );
}
