import { useMemo, useState } from 'react';
import { CupSoda, SlidersHorizontal } from 'lucide-react';
import FilterBar from './components/FilterBar.jsx';
import ShopCard from './components/ShopCard.jsx';
import ShopDetail from './components/ShopDetail.jsx';
import ShortlistBar from './components/ShortlistBar.jsx';
import { PRICE_BANDS, SHOPS } from './data/shops.js';
import { useShortlist } from './hooks/useShortlist.js';

const DEFAULT_FILTERS = {
  keyword: '',
  category: 'all',
  area: 'all',
  price: 'all',
  tags: [],
};

const SORTS = [
  { id: 'default', label: '推薦排序' },
  { id: 'priceAsc', label: '價位由低到高' },
  { id: 'priceDesc', label: '價位由高到低' },
  { id: 'name', label: '依店名' },
];

function matches(shop, filters) {
  if (filters.category !== 'all' && shop.category !== filters.category) return false;
  if (filters.area !== 'all' && !shop.areas.includes(filters.area)) return false;

  const band = PRICE_BANDS.find((item) => item.id === filters.price);
  if (band && !band.test(shop)) return false;

  // 標籤採「全部符合」，勾越多條件越嚴格，符合一般人縮小範圍的直覺。
  if (filters.tags.some((tag) => !shop.tags.includes(tag))) return false;

  const keyword = filters.keyword.trim().toLowerCase();
  if (keyword) {
    const haystack = [shop.name, shop.enName, shop.desc, ...shop.signatures].join(' ').toLowerCase();
    if (!haystack.includes(keyword)) return false;
  }

  return true;
}

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('default');
  const [active, setActive] = useState(null);
  const shortlist = useShortlist();

  const hasActiveFilter =
    filters.keyword.trim() !== '' ||
    filters.category !== 'all' ||
    filters.area !== 'all' ||
    filters.price !== 'all' ||
    filters.tags.length > 0;

  const visible = useMemo(() => {
    const list = SHOPS.filter((shop) => matches(shop, filters));
    const sorted = [...list];
    if (sort === 'priceAsc') sorted.sort((a, b) => a.priceMin - b.priceMin);
    if (sort === 'priceDesc') sorted.sort((a, b) => b.priceMax - a.priceMax);
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
    return sorted;
  }, [filters, sort]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex items-center gap-2 text-brand-600">
            <CupSoda className="h-5 w-5" />
            <span className="text-sm font-medium tracking-wide">淡水手搖地圖</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            淡水連鎖飲料店統整
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
            收錄 {SHOPS.length} 個在淡水常見的連鎖品牌，可依分類、地區、價位與特色篩選。
            把想喝的店加進待選清單，猶豫時就讓它幫你抽一家。
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-32 pt-6 sm:px-6">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          hasActiveFilter={hasActiveFilter}
        />

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-500">
            共 <span className="font-semibold tabular-nums text-ink-900">{visible.length}</span> 家
          </p>

          <label className="flex items-center gap-2 text-sm text-ink-500">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">排序方式</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="focus-ring rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-ink-900"
            >
              {SORTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 rounded-card border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-medium text-ink-900">沒有符合條件的店</p>
            <p className="mt-2 text-sm text-ink-500">試著放寬價位，或清除幾個特色標籤。</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((shop, index) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                index={index}
                picked={shortlist.has(shop.id)}
                onToggle={shortlist.toggle}
                onOpen={setActive}
              />
            ))}
          </div>
        )}

        <p className="mt-10 text-xs leading-relaxed text-ink-400">
          資料整理自各品牌公開資訊，價位區間與門市分布僅供參考，實際菜單、售價與營業狀況請以官方公告為準。
        </p>
      </main>

      <ShopDetail
        shop={active}
        picked={active ? shortlist.has(active.id) : false}
        onToggle={shortlist.toggle}
        onClose={() => setActive(null)}
      />

      <ShortlistBar
        shops={shortlist.shops}
        onRemove={shortlist.remove}
        onClear={shortlist.clear}
        onOpen={setActive}
      />
    </div>
  );
}
