import { getStatus } from '../data/orderStatus.js';

export default function StatusBadge({ status, size = 'md', withIcon = true }) {
  const config = getStatus(status);
  const Icon = config.icon;
  const sizing = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizing} ${config.badge}`}
    >
      {withIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </span>
  );
}
