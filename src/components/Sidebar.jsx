import { motion } from 'framer-motion';
import { UtensilsCrossed, LayoutDashboard, ClipboardList, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'order', label: '我要點餐', description: '選餐點 · 選飲料 · 填姓名', icon: ClipboardList },
  { id: 'dashboard', label: '訂單總覽', description: '統計 · 圖表 · 訂單管理', icon: LayoutDashboard },
];

function NavList({ current, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = current === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`focus-ring group relative flex items-start gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors duration-200 ${
              active ? 'text-brand-700' : 'text-ink-500 hover:bg-slate-100/80 hover:text-ink-700'
            }`}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-2xl bg-brand-50 ring-1 ring-inset ring-brand-100"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <Icon className={`relative z-10 mt-0.5 h-[18px] w-[18px] ${active ? 'text-brand-600' : ''}`} />
            <span className="relative z-10">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="mt-0.5 block text-xs text-ink-400">{item.description}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
        <UtensilsCrossed className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-[15px] font-semibold tracking-tight text-ink-900">簡易點餐系統</span>
        <span className="block text-xs text-ink-400">Order Studio</span>
      </span>
    </div>
  );
}

export default function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* 桌機側邊欄 */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-slate-200/70 bg-white/80 px-4 py-6 backdrop-blur-xl lg:flex">
        <div className="flex flex-col gap-8">
          <div className="px-1">
            <Brand />
          </div>
          <NavList current={current} onNavigate={onNavigate} />
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-ink-400">
          <p className="font-semibold text-ink-700">Prototype 展示</p>
          <p className="mt-1">所有資料皆為 Mock Data，僅保存在瀏覽器本機。</p>
        </div>
      </aside>

      {/* 手機抽屜式選單 */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 left-0 flex w-72 flex-col gap-8 bg-white px-4 py-6 shadow-2xl"
          >
            <div className="flex items-center justify-between px-1">
              <Brand />
              <button
                type="button"
                onClick={onCloseMobile}
                className="focus-ring rounded-full p-2 text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-700"
                aria-label="關閉選單"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavList
              current={current}
              onNavigate={(id) => {
                onNavigate(id);
                onCloseMobile();
              }}
            />
          </motion.aside>
        </div>
      )}
    </>
  );
}
