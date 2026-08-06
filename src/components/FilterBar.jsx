import { Search, X } from 'lucide-react';
import { AREAS, CATEGORIES, PRICE_BANDS, TAGS } from '../data/shops.js';

function Chip({ active, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`focus-ring shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200 ${
        active
          ? 'border-ink-900 bg-ink-900 text-white'
          : 'border-slate-200 bg-white text-ink-700 hover:bg-slate-50'
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * 篩選列：關鍵字、分類、地區、價位、特色標籤。
 * 手機上每一排都可橫向捲動，不擠壓垂直空間。
 */
export default function FilterBar({ filters, onChange, onReset, hasActiveFilter }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  const toggleTag = (tagId) =>
    set({
      tags: filters.tags.includes(tagId)
        ? filters.tags.filter((id) => id !== tagId)
        : [...filters.tags, tagId],
    });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={filters.keyword}
          onChange={(event) => set({ keyword: event.target.value })}
          placeholder="搜尋店名或想喝的品項，例如「烏龍」「珍珠」"
          aria-label="搜尋飲料店"
          className="focus-ring w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400"
        />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORIES.map((item) => (
          <Chip
            key={item.id}
            active={filters.category === item.id}
            onClick={() => set({ category: item.id })}
          >
            {item.label}
          </Chip>
        ))}
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {AREAS.map((item) => (
          <Chip key={item.id} active={filters.area === item.id} onClick={() => set({ area: item.id })}>
            {item.label}
          </Chip>
        ))}
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {PRICE_BANDS.map((item) => (
          <Chip key={item.id} active={filters.price === item.id} onClick={() => set({ price: item.id })}>
            {item.label}
          </Chip>
        ))}
        {TAGS.map((item) => (
          <Chip key={item.id} active={filters.tags.includes(item.id)} onClick={() => toggleTag(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={onReset}
          className="focus-ring inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-ink-500 transition-colors duration-200 hover:text-ink-900"
        >
          <X className="h-3.5 w-3.5" />
          清除篩選
        </button>
      )}
    </div>
  );
}
