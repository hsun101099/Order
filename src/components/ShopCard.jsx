import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { AREA_LABEL, CATEGORY_LABEL, TAG_LABEL } from '../data/shops.js';

/**
 * 品牌卡片：先讓人一眼看到店名、招牌品項與價位，
 * 右上角的按鈕負責把它加進待選清單。
 */
export default function ShopCard({ shop, picked = false, onToggle, onOpen, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col overflow-hidden rounded-card border bg-white transition-all duration-300 ease-out ${
        picked
          ? 'border-brand-600 shadow-card-hover ring-1 ring-brand-600'
          : 'border-slate-200/70 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover'
      }`}
    >
      {/* 整張卡片可點開詳細，加入待選的按鈕再疊在上層 */}
      <button
        type="button"
        onClick={() => onOpen(shop)}
        aria-label={`查看 ${shop.name} 的詳細資訊`}
        className="focus-ring absolute inset-0 z-0 rounded-card"
      />

      <span className="h-1.5 w-full" style={{ backgroundColor: shop.accent }} />

      <div className="pointer-events-none flex flex-1 flex-col gap-3 p-5">
        {/* 右上角留給待選按鈕，標題區塊因此需要留白 */}
        <div className="pr-10">
          <h3 className="text-lg font-semibold tracking-tight text-ink-900">{shop.name}</h3>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-400">{shop.enName}</p>
          <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-ink-500">
            {CATEGORY_LABEL.get(shop.category)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-ink-500 line-clamp-2">{shop.desc}</p>

        <div className="flex flex-wrap gap-1.5">
          {shop.signatures.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-ink-700"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-sm font-semibold tabular-nums text-ink-900">
              ${shop.priceMin}–{shop.priceMax}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {shop.areas.map((area) => AREA_LABEL.get(area)).filter(Boolean).join('、')}
            </p>
          </div>

          {shop.tags.length > 0 && (
            <p className="text-right text-xs text-ink-400">
              {shop.tags.map((tag) => TAG_LABEL.get(tag)).filter(Boolean).slice(0, 2).join(' · ')}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggle(shop.id)}
        aria-pressed={picked}
        aria-label={picked ? `把 ${shop.name} 移出待選` : `把 ${shop.name} 加入待選`}
        className={`focus-ring absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
          picked
            ? 'bg-brand-600 text-white hover:bg-brand-700'
            : 'border border-slate-200 bg-white/90 text-ink-500 hover:bg-slate-50 hover:text-ink-900'
        }`}
      >
        {picked ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
    </motion.article>
  );
}
