import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Shuffle, Trash2, X } from 'lucide-react';

/**
 * 待選清單列：固定在畫面底部，隨時看得到自己挑了哪幾家，
 * 拿不定主意時可以直接請它隨機抽一家。
 */
export default function ShortlistBar({ shops, onRemove, onClear, onOpen }) {
  const [expanded, setExpanded] = useState(false);
  const [drawn, setDrawn] = useState(null);

  const draw = () => {
    if (shops.length === 0) return;
    const picked = shops[Math.floor(Math.random() * shops.length)];
    setDrawn(picked);
  };

  return (
    <AnimatePresence>
      {shops.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/95 backdrop-blur"
        >
          <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
            {drawn && (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-card bg-brand-50 px-4 py-3">
                <p className="text-sm text-brand-700">
                  今天就喝 <span className="font-semibold">{drawn.name}</span> 吧
                  <span className="ml-2 text-brand-600/80">{drawn.signatures[0]}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setDrawn(null)}
                  aria-label="關閉推薦"
                  className="focus-ring rounded-full p-1 text-brand-600 hover:bg-brand-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {expanded && (
              <ul className="mb-3 max-h-48 space-y-1.5 overflow-y-auto">
                {shops.map((shop) => (
                  <li
                    key={shop.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(shop)}
                      className="focus-ring flex min-w-0 items-center gap-2 rounded-lg text-left"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: shop.accent }}
                      />
                      <span className="truncate text-sm text-ink-900">{shop.name}</span>
                      <span className="shrink-0 text-xs tabular-nums text-ink-400">
                        ${shop.priceMin}–{shop.priceMax}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(shop.id)}
                      aria-label={`移除 ${shop.name}`}
                      className="focus-ring rounded-full p-1 text-ink-400 transition-colors duration-200 hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="focus-ring flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-ink-700 transition-colors duration-200 hover:text-ink-900"
              >
                待選 <span className="font-semibold tabular-nums">{shops.length}</span> 家
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={onClear}
                aria-label="清空待選清單"
                className="focus-ring rounded-full p-2 text-ink-400 transition-colors duration-200 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={draw}
                className="focus-ring ml-auto flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-700"
              >
                <Shuffle className="h-4 w-4" />
                幫我選一家
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
