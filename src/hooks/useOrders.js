import { useCallback, useEffect, useMemo, useState } from 'react';
import { calcTotal } from '../data/mockOrders.js';
import { DRINKS, MEALS } from '../data/menu.js';
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

  useEffect(() => {
    const unsubscribe = ordersRepository.subscribe(
      (next) => {
        setOrders(next);
        setLoading(false);
      },
      (subscribeError) => {
        setError(subscribeError);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const addOrder = useCallback(async ({ customerName, mealId, drinkId, note }) => {
    const order = {
      customerName: customerName.trim(),
      mealId,
      drinkId,
      note: note?.trim() ?? '',
      total: calcTotal(mealId, drinkId),
      createdAt: new Date().toISOString(),
    };
    return ordersRepository.add(order);
  }, []);

  const removeOrder = useCallback((id) => ordersRepository.remove(id), []);

  const resetOrders = useCallback(() => ordersRepository.reset(), []);

  /** 依餐點、飲料分組，並算出總份數與金額。 */
  const tally = useMemo(() => {
    const group = (items, key) =>
      items.map((item) => {
        const people = orders
          .filter((order) => order[key] === item.id)
          .map((order) => order.customerName);
        return { ...item, people, count: people.length };
      });

    return {
      meals: group(MEALS, 'mealId'),
      drinks: group(DRINKS, 'drinkId'),
      people: orders.length,
      total: orders.reduce((sum, order) => sum + order.total, 0),
    };
  }, [orders]);

  return {
    orders,
    tally,
    loading,
    error,
    source: ordersRepository.source,
    addOrder,
    removeOrder,
    resetOrders,
  };
}
