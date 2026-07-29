const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const fullDateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

export const formatDateTime = (iso) => dateFormatter.format(new Date(iso));

export const formatToday = (date = new Date()) => fullDateFormatter.format(date);

export const formatCurrency = (amount) => `NT$ ${Number(amount).toLocaleString('zh-TW')}`;

/** 「3 分鐘前 / 2 小時前 / 昨天」等相對時間，用於列表與 Drawer。 */
export const formatRelative = (iso, now = Date.now()) => {
  const diffMinutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (diffMinutes < 1) return '剛剛';
  if (diffMinutes < 60) return `${diffMinutes} 分鐘前`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours} 小時前`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '昨天' : `${days} 天前`;
};

export const isToday = (iso, now = new Date()) => {
  const date = new Date(iso);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};
