import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = '搜尋…' }) {
  return (
    <div className="group relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-brand-600" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all duration-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="focus-ring absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-700"
          aria-label="清除搜尋"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
