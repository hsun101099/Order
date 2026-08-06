import { useCallback, useEffect, useState } from 'react';
import { SHOP_MAP } from '../data/shops.js';

const STORAGE_KEY = 'tamsui-drinks:shortlist';

function readStored() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // 品牌資料會增修，開啟時先濾掉已不存在的 id，避免留下空殼。
    return Array.isArray(parsed) ? parsed.filter((id) => SHOP_MAP.has(id)) : [];
  } catch {
    return [];
  }
}

/**
 * 待選清單：使用者把想喝的店先收進來，最後再從中挑一家。
 * 只存在瀏覽器本機，換裝置不會同步。
 */
export function useShortlist() {
  const [ids, setIds] = useState(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // 無痕模式等情境會寫入失敗，功能仍可在本次瀏覽中使用。
    }
  }, [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  const remove = useCallback((id) => {
    setIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  return { ids, shops: ids.map((id) => SHOP_MAP.get(id)).filter(Boolean), toggle, remove, clear, has };
}
