import { useCallback, useEffect, useMemo, useState } from 'react';
import { calcTotal, createMockOrders } from '../data/mockOrders.js';
import { DRINKS, MEALS } from '../data/menu.js';

const STORAGE_KEY = 'order-system.orders.v2';

const readStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * 這一輪大家點的餐。初次載入使用展示資料，
 * 之後的變動會寫回 localStorage，重新整理仍在。
 */
export function useOrders() {
  const [orders, setOrders] = useState(() => readStorage() ?? createMockOrders());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* 無痕模式或空間不足時忽略，不影響操作。 */
    }
  }, [orders]);

  const addOrder = useCallback(({ customerName, mealId, drinkId, note }) => {
    const order = {
      id: `order-${Date.now()}`,
      customerName: customerName.trim(),
      mealId,
      drinkId,
      note: note?.trim() ?? '',
      total: calcTotal(mealId, drinkId),
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, order]);
    return order;
  }, []);

  const removeOrder = useCallback((id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }, []);

  const resetOrders = useCallback(() => setOrders(createMockOrders()), []);

  /** 依餐點、飲料分組，並算出總份數與金額。 */
  const tally = useMemo(() => {
    const group = (items, key) =>
      items
        .map((item) => ({
          ...item,
          people: orders.filter((order) => order[key] === item.id).map((order) => order.customerName),
        }))
        .map((item) => ({ ...item, count: item.people.length }));

    return {
      meals: group(MEALS, 'mealId'),
      drinks: group(DRINKS, 'drinkId'),
      people: orders.length,
      total: orders.reduce((sum, order) => sum + order.total, 0),
    };
  }, [orders]);

  return { orders, tally, addOrder, removeOrder, resetOrders };
}
