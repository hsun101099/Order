import { Bell, Menu } from 'lucide-react';
import { formatToday } from '../utils/format.js';

export default function Header({ title, subtitle, notificationCount = 0, onOpenMenu }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-canvas/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="focus-ring rounded-xl border border-slate-200 bg-white p-2 text-ink-500 transition-colors hover:text-ink-900 lg:hidden"
            aria-label="開啟選單"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-ink-900 sm:text-xl">
              {title}
            </h1>
            <p className="mt-0.5 truncate text-xs text-ink-400 sm:text-sm">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-500 md:inline-block">
            {formatToday()}
          </span>

          <button
            type="button"
            className="focus-ring relative rounded-full border border-slate-200 bg-white p-2.5 text-ink-500 transition-all duration-200 hover:-translate-y-0.5 hover:text-ink-900 hover:shadow-card"
            aria-label={`通知，${notificationCount} 則未讀`}
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white ring-2 ring-canvas">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-1 sm:pr-3.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white">
              店長
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold leading-tight text-ink-900">王小明</span>
              <span className="block text-[11px] leading-tight text-ink-400">門市管理員</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
