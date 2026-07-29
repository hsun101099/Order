const STORAGE_KEY = 'order-system.mine.v1';

/**
 * 記錄「這台裝置送出過哪幾筆訂單」，用來限制只能刪除自己的餐點。
 *
 * 這個系統沒有登入機制，因此身分只能記在本機：換裝置或清除瀏覽器資料後，
 * 原本那幾筆就不再顯示刪除鍵。若需要真正無法繞過的限制，
 * 必須改用 Firebase Authentication 並在安全規則中比對 uid。
 */
const read = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (ids) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* 無痕模式或空間不足時忽略。 */
  }
};

export const getOwnedIds = () => new Set(read());

export const rememberOwned = (id) => {
  const ids = read();
  if (!ids.includes(id)) {
    ids.push(id);
    write(ids);
  }
  return new Set(ids);
};

export const forgetOwned = (id) => {
  const ids = read().filter((owned) => owned !== id);
  write(ids);
  return new Set(ids);
};

export const clearOwned = () => {
  write([]);
  return new Set();
};
