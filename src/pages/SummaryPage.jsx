import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Plus, RotateCcw, Soup } from 'lucide-react';
import TallyCard from '../components/TallyCard.jsx';
import PersonList from '../components/PersonList.jsx';
import { formatCurrency } from '../utils/format.js';

/** 產出可直接貼到群組的文字版統整。 */
const buildShareText = (tally) => {
  const line = (items, unit) =>
    items
      .filter((item) => item.count > 0)
      .map((item) => `${item.name} ${item.count}${unit}`)
      .join('、');

  return [
    `今天總共 ${tally.people} 份`,
    `餐點：${line(tally.meals, '份') || '尚未有人點餐'}`,
    `飲料：${line(tally.drinks, '杯') || '尚未有人點飲料'}`,
    `合計 ${formatCurrency(tally.total)}`,
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

export default function SummaryPage({ orders, tally, onRemove, onReset, onNavigate }) {
  const [copied, setCopied] = useState(false);

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
    <div className="flex flex-col gap-10">
      {/* 一句話看完 */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-[24px] bg-gradient-to-br from-ink-900 to-slate-700 px-7 py-8 text-white"
      >
        <p className="text-sm text-white/60">今天一起吃</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{tally.people} 個人，一人一份</p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {tally.meals
            .filter((meal) => meal.count > 0)
            .map((meal) => `${meal.name} ${meal.count}`)
            .join('、')}
          <span className="mx-2 text-white/30">|</span>
          {tally.drinks
            .filter((drink) => drink.count > 0)
            .map((drink) => `${drink.name} ${drink.count}`)
            .join('、')}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <span className="text-2xl font-semibold tabular-nums">{formatCurrency(tally.total)}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/15 transition-colors duration-200 hover:bg-white/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? '已複製' : '複製訂單'}
          </button>
        </div>
      </motion.section>

      {/* 餐點統整 */}
      <section>
        <h2 className="px-1 text-sm font-semibold text-ink-900">餐點</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tally.meals.map((meal, index) => (
            <TallyCard key={meal.id} item={meal} index={index} unit="份" />
          ))}
        </div>
      </section>

      {/* 飲料統整 */}
      <section>
        <h2 className="px-1 text-sm font-semibold text-ink-900">飲料</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tally.drinks.map((drink, index) => (
            <TallyCard key={drink.id} item={drink} index={index} unit="杯" />
          ))}
        </div>
      </section>

      {/* 每個人 */}
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

        <div className="mt-3 rounded-[24px] border border-slate-200/70 bg-white px-5 py-1 shadow-card">
          <PersonList orders={orders} onRemove={onRemove} />
        </div>
      </section>
    </div>
  );
}
