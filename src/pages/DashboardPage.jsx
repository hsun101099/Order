import { useMemo, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Timer,
  RotateCcw,
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterTabs from '../components/FilterTabs.jsx';
import OrderTable, { isDelayed } from '../components/OrderTable.jsx';
import { BarChart, DonutChart, TrendChart } from '../components/Chart.jsx';
import { DRINKS, MEALS, TONE_STYLES, findDrink, findMeal } from '../data/menu.js';
import { STATUS_FILTERS } from '../data/orderStatus.js';
import { formatCurrency } from '../utils/format.js';

const DONUT_COLORS = { soda: '#2563EB', 'unsweetened-tea': '#16A34A' };

/** 依建立時間分組為最近 8 個小時的訂單量。 */
function buildHourlyTrend(orders, now = new Date()) {
  const buckets = Array.from({ length: 8 }, (_, index) => {
    const date = new Date(now);
    date.setMinutes(0, 0, 0);
    date.setHours(date.getHours() - (7 - index));
    return { date, label: `${String(date.getHours()).padStart(2, '0')}:00`, value: 0 };
  });

  orders.forEach((order) => {
    const created = new Date(order.createdAt).getTime();
    const bucket = buckets.find(
      (item) => created >= item.date.getTime() && created < item.date.getTime() + 3600000
    );
    if (bucket) bucket.value += 1;
  });

  return buckets.map(({ label, value }) => ({ label, value }));
}

export default function DashboardPage({ orders, stats, onSelectOrder, onReset }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return orders.filter((order) => {
      if (filter !== 'all' && order.status !== filter) return false;
      if (!keyword) return true;

      const meal = findMeal(order.mealId)?.name ?? '';
      const drink = findDrink(order.drinkId)?.name ?? '';
      return [order.customerName, order.code, meal, drink, String(order.total)]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    });
  }, [orders, query, filter]);

  const filterCounts = useMemo(
    () => ({
      all: orders.length,
      ...STATUS_FILTERS.reduce((acc, item) => {
        if (item.id !== 'all') acc[item.id] = stats.byStatus[item.id] ?? 0;
        return acc;
      }, {}),
    }),
    [orders.length, stats.byStatus]
  );

  const mealChartData = useMemo(
    () =>
      MEALS.map((meal) => ({
        id: meal.id,
        label: meal.name,
        value: orders.filter((order) => order.mealId === meal.id && order.status !== 'cancelled')
          .length,
        colorClass: TONE_STYLES[meal.tone].bar,
      })),
    [orders]
  );

  const drinkChartData = useMemo(
    () =>
      DRINKS.map((drink) => ({
        id: drink.id,
        label: drink.name,
        value: orders.filter((order) => order.drinkId === drink.id && order.status !== 'cancelled')
          .length,
        color: DONUT_COLORS[drink.id],
      })),
    [orders]
  );

  const trendData = useMemo(() => buildHourlyTrend(orders), [orders]);

  const delayedCount = useMemo(() => {
    const now = Date.now();
    return orders.filter((order) => isDelayed(order, now)).length;
  }, [orders]);

  const drinkTotal = drinkChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* 第一區：關鍵數字 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          index={0}
          icon={ClipboardList}
          label="總訂單"
          value={stats.total}
          unit="筆"
          hint="含已完成與已取消"
          tone="brand"
        />
        <SummaryCard
          index={1}
          icon={Timer}
          label="處理中"
          value={stats.inProgress}
          unit="筆"
          hint={delayedCount > 0 ? `${delayedCount} 筆等候過久` : '流程順暢'}
          tone="amber"
        />
        <SummaryCard
          index={2}
          icon={CheckCircle2}
          label="已完成"
          value={stats.completed}
          unit="筆"
          hint="顧客已取餐"
          tone="emerald"
        />
        <SummaryCard
          index={3}
          icon={Ban}
          label="已取消"
          value={stats.cancelled}
          unit="筆"
          hint="不列入營業額"
          tone="rose"
        />
      </section>

      {/* 第二區：圖表 */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-900">餐點分布</h2>
          <p className="mt-1 text-xs text-ink-400">各主餐的有效訂單數量</p>
          <div className="mt-6">
            <BarChart data={mealChartData} />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-900">飲料比例</h2>
          <p className="mt-1 text-xs text-ink-400">汽水與無糖茶的選擇占比</p>
          <div className="mt-6">
            <DonutChart data={drinkChartData} centerLabel="杯" centerValue={drinkTotal} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-ink-900">近 8 小時訂單量</h2>
              <p className="mt-1 text-xs text-ink-400">依建立時間統計</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-success">
              <CircleDollarSign className="h-3.5 w-3.5" />
              {formatCurrency(stats.revenue)}
            </span>
          </div>
          <div className="mt-6">
            <TrendChart data={trendData} />
          </div>
        </div>
      </section>

      {/* 第三區：訂單列表 */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-ink-900">訂單列表</h2>
            <p className="mt-0.5 text-xs text-ink-400">
              共 {filteredOrders.length} 筆 · 點擊任一筆可開啟詳細資訊
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="搜尋姓名、訂單編號、餐點、金額"
            />
            <button
              type="button"
              onClick={onReset}
              title="重設為展示資料"
              className="focus-ring shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-ink-400 transition-colors hover:text-ink-900"
              aria-label="重設為展示資料"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <FilterTabs items={STATUS_FILTERS} value={filter} onChange={setFilter} counts={filterCounts} />

        <OrderTable orders={filteredOrders} onSelect={onSelectOrder} />
      </section>
    </div>
  );
}
