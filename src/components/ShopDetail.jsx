import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import { AREA_LABEL, CATEGORY_LABEL, TAG_LABEL } from '../data/shops.js';

/**
 * 品牌詳細：以底部滑出的面板呈現，手機單手好操作。
 */
export default function ShopDetail({ shop, picked, onToggle, onClose }) {
  useEffect(() => {
    if (!shop) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shop, onClose]);

  return (
    <AnimatePresence>
      {shop && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="關閉"
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${shop.name} 詳細資訊`}
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-drawer sm:rounded-card"
          >
            <span className="block h-1.5 w-full" style={{ backgroundColor: shop.accent }} />

            <button
              type="button"
              onClick={onClose}
              aria-label="關閉"
              className="focus-ring absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors duration-200 hover:bg-slate-100 hover:text-ink-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
              <header className="pr-10">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900">{shop.name}</h2>
                <p className="mt-1 text-xs uppercase tracking-wide text-ink-400">{shop.enName}</p>
              </header>

              <p className="text-sm leading-relaxed text-ink-700">{shop.desc}</p>

              <dl className="grid grid-cols-2 gap-4 rounded-card bg-slate-50 p-4">
                <div>
                  <dt className="text-xs text-ink-400">分類</dt>
                  <dd className="mt-1 text-sm font-medium text-ink-900">
                    {CATEGORY_LABEL.get(shop.category)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-400">價位參考</dt>
                  <dd className="mt-1 text-sm font-medium tabular-nums text-ink-900">
                    ${shop.priceMin}–{shop.priceMax}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-ink-400">淡水常見區域</dt>
                  <dd className="mt-1 text-sm font-medium text-ink-900">
                    {shop.areas.map((area) => AREA_LABEL.get(area)).filter(Boolean).join('、')}
                  </dd>
                </div>
              </dl>

              <section>
                <h3 className="text-sm font-semibold text-ink-900">招牌品項</h3>
                <ul className="mt-2 space-y-1.5">
                  {shop.signatures.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-ink-700">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: shop.accent }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {shop.tags.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-ink-900">特色</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {shop.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-ink-700"
                      >
                        {TAG_LABEL.get(tag)}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <p className="text-xs leading-relaxed text-ink-400">
                價位與門市分布為參考資訊，各品牌會調整菜單與展店，實際請以官方公告為準。
              </p>
            </div>

            <div className="border-t border-slate-200/70 bg-white p-4">
              <button
                type="button"
                onClick={() => onToggle(shop.id)}
                className={`focus-ring flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors duration-200 ${
                  picked
                    ? 'border border-slate-200 bg-white text-ink-700 hover:bg-slate-50'
                    : 'bg-ink-900 text-white hover:bg-ink-700'
                }`}
              >
                {picked ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {picked ? '已在待選清單中' : '加入待選清單'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
