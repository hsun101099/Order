import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildOrderCode, calcTotal, createMockOrders, NEXT_SERIAL } from '../data/mockOrders.js';
import { getNextStatus } from '../data/orderStatus.js';

const STORAGE_KEY = 'order-system.orders.v1';
const SERIAL_KEY = 'order-system.serial.v1';

const readStorage = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 無痕模式或空間不足時忽略，不影響操作。 */
  }
};

/**
 * 訂單資料來源：初次載入使用 Mock Data，之後的操作會寫回 localStorage，
 * 讓 Prototype 重新整理後仍保有情境。
 */
export function useOrders() {
  const [orders, setOrders] = useState(() => readStorage(STORAGE_KEY) ?? createMockOrders());
  const [serial, setSerial] = useState(() => readStorage(SERIAL_KEY) ?? NEXT_SERIAL);

  useEffect(() => {
    writeStorage(STORAGE_KEY, orders);
  }, [orders]);

  useEffect(() => {
    writeStorage(SERIAL_KEY, serial);
  }, [serial]);

  const addOrder = useCallback(
    ({ customerName, mealId, drinkId, note }) => {
      const now = new Date().toISOString();
      const order = {
        id: `order-${Date.now()}`,
        code: buildOrderCode(serial),
        customerName: customerName.trim(),
        mealId,
        drinkId,
        note: note?.trim() ?? '',
        status: 'pending',
        total: calcTotal(mealId, drinkId),
        createdAt: now,
        updatedAt: now,
      };
      setOrders((prev) => [order, ...prev]);
      setSerial((prev) => prev + 1);
      return order;
    },
    [serial]
  );

  const updateOrder = useCallback((id, patch) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, ...patch, updatedAt: new Date().toISOString() } : order
      )
    );
  }, []);

  const advanceOrder = useCallback(
    (id) => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== id) return order;
          const next = getNextStatus(order.status);
          if (!next) return order;
          return { ...order, status: next, updatedAt: new Date().toISOString() };
        })
      );
    },
    []
  );

  const cancelOrder = useCallback(
    (id) => updateOrder(id, { status: 'cancelled' }),
    [updateOrder]
  );

  const resetOrders = useCallback(() => {
    const fresh = createMockOrders();
    setOrders(fresh);
    setSerial(NEXT_SERIAL);
  }, []);

  const stats = useMemo(() => {
    const byStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    }, {});

    const revenue = orders
      .filter((order) => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    return {
      total: orders.length,
      inProgress: (byStatus.pending ?? 0) + (byStatus.preparing ?? 0) + (byStatus.ready ?? 0),
      completed: byStatus.completed ?? 0,
      cancelled: byStatus.cancelled ?? 0,
      byStatus,
      revenue,
    };
  }, [orders]);

  return { orders, stats, addOrder, updateOrder, advanceOrder, cancelOrder, resetOrders };
}
