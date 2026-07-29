import { useCallback, useEffect, useMemo, useState } from 'react';
import { DRINKS, MEALS, PORTIONS_PER_PERSON } from '../data/menu.js';
import { ordersRepository } from '../lib/ordersRepository.js';

/**
 * 這一輪大家點的餐。
 * 資料來源由 ordersRepository 決定：有設定 Firebase 就即時同步，
 * 沒有設定則使用瀏覽器本機儲存，兩者對外的操作介面完全一樣。
 */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // 連不上 Firestore 時第一筆資料可能遲遲不來，
    // 逾時後先讓使用者能操作（點的餐會排入佇列，恢復連線再送出）。
    const timeout = setTimeout(() => {
      setLoading(false);
      setOffline(true);
    }, 6000);

    const unsubscribe = ordersRepository.subscribe(
      (next, meta = {}) => {
        clearTimeout(timeout);
        setOrders(next);
        setOffline(Boolean(meta.fromCache));
        setLoading(false);
      },
      (subscribeError) => {
        clearTimeout(timeout);
        setError(subscribeError);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const addOrder = useCallback(async ({ customerName, meals, drinks, note }) => {
    const order = {
      customerName: customerName.trim(),
      meals,
      drinks,
      note: note?.trim() ?? '',
      createdAt: new Date().toISOString(),
    };
    return ordersRepository.add(order);
  }, []);

  const removeOrder = useCallback((id) => ordersRepository.remove(id), []);

  const resetOrders = useCallback(() => ordersRepository.reset(), []);

  /**
   * 依品項分組：每個品項的總份數，以及誰點了幾份。
   * 同一個人點兩份同款時會記成 count 2，不會出現重複的名字。
   */
  const tally = useMemo(() => {
    const group = (items, key) =>
      items.map((item) => {
        const people = [];
        let count = 0;

        orders.forEach((order) => {
          const picked = (order[key] ?? []).filter((id) => id === item.id).length;
          if (picked === 0) return;
          count += picked;
          people.push({ name: order.customerName, count: picked });
        });

        return { ...item, people, count };
      });

    return {
      meals: group(MEALS, 'meals'),
      drinks: group(DRINKS, 'drinks'),
      people: orders.length,
      portions: orders.length * PORTIONS_PER_PERSON,
    };
  }, [orders]);

  return {
    orders,
    tally,
    loading,
    error,
    offline,
    source: ordersRepository.source,
    addOrder,
    removeOrder,
    resetOrders,
  };
}
