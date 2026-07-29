import { findDrink, findMeal } from './menu.js';

/**
 * 展示用資料：20 筆不同顧客的訂單。
 * minutesAgo 為「距今幾分鐘建立」，讓每次開啟系統時間都是相對新鮮的。
 */
const SEED = [
  { name: '林宜蓁', mealId: 'cheese-beef', drinkId: 'soda', status: 'completed', minutesAgo: 512, note: '起司加量' },
  { name: '陳柏睿', mealId: 'spicy-chicken', drinkId: 'unsweetened-tea', status: 'completed', minutesAgo: 466, note: '不要太辣' },
  { name: '黃思穎', mealId: 'bbq-pork', drinkId: 'soda', status: 'completed', minutesAgo: 430, note: '' },
  { name: '張家瑋', mealId: 'peanut-beef', drinkId: 'unsweetened-tea', status: 'completed', minutesAgo: 398, note: '花生醬另外附' },
  { name: '吳沛慈', mealId: 'cheese-beef', drinkId: 'unsweetened-tea', status: 'completed', minutesAgo: 366, note: '' },
  { name: '劉宗翰', mealId: 'spicy-chicken', drinkId: 'soda', status: 'cancelled', minutesAgo: 344, note: '顧客臨時有事取消' },
  { name: '蔡欣妤', mealId: 'bbq-pork', drinkId: 'unsweetened-tea', status: 'completed', minutesAgo: 305, note: '醬料減量' },
  { name: '鄭皓宇', mealId: 'peanut-beef', drinkId: 'soda', status: 'completed', minutesAgo: 271, note: '' },
  { name: '許雅琳', mealId: 'cheese-beef', drinkId: 'soda', status: 'completed', minutesAgo: 238, note: '外帶' },
  { name: '謝俊霖', mealId: 'spicy-chicken', drinkId: 'unsweetened-tea', status: 'cancelled', minutesAgo: 214, note: '重複下單' },
  { name: '洪千惠', mealId: 'bbq-pork', drinkId: 'soda', status: 'completed', minutesAgo: 186, note: '' },
  { name: '曾語彤', mealId: 'peanut-beef', drinkId: 'unsweetened-tea', status: 'completed', minutesAgo: 152, note: '飲料去冰' },
  { name: '王柏勛', mealId: 'cheese-beef', drinkId: 'unsweetened-tea', status: 'ready', minutesAgo: 74, note: '' },
  { name: '李孟璇', mealId: 'spicy-chicken', drinkId: 'soda', status: 'ready', minutesAgo: 58, note: '加辣' },
  { name: '周佳蓉', mealId: 'bbq-pork', drinkId: 'unsweetened-tea', status: 'preparing', minutesAgo: 41, note: '兩份分開包' },
  { name: '徐立宸', mealId: 'peanut-beef', drinkId: 'soda', status: 'preparing', minutesAgo: 33, note: '' },
  { name: '潘思妤', mealId: 'cheese-beef', drinkId: 'soda', status: 'preparing', minutesAgo: 26, note: '不要洋蔥' },
  { name: '簡宥廷', mealId: 'spicy-chicken', drinkId: 'unsweetened-tea', status: 'pending', minutesAgo: 17, note: '' },
  { name: '賴宣妤', mealId: 'bbq-pork', drinkId: 'soda', status: 'pending', minutesAgo: 9, note: '醬汁另外裝' },
  { name: '方冠廷', mealId: 'peanut-beef', drinkId: 'unsweetened-tea', status: 'pending', minutesAgo: 3, note: '' },
];

const pad = (value, length = 3) => String(value).padStart(length, '0');

export const buildOrderCode = (serial) => `OD-${pad(serial, 4)}`;

export const calcTotal = (mealId, drinkId) =>
  (findMeal(mealId)?.price ?? 0) + (findDrink(drinkId)?.price ?? 0);

export const createMockOrders = (now = Date.now()) =>
  SEED.map((seed, index) => {
    const createdAt = new Date(now - seed.minutesAgo * 60 * 1000).toISOString();
    return {
      id: `mock-${index + 1}`,
      code: buildOrderCode(index + 1),
      customerName: seed.name,
      mealId: seed.mealId,
      drinkId: seed.drinkId,
      status: seed.status,
      note: seed.note,
      total: calcTotal(seed.mealId, seed.drinkId),
      createdAt,
      updatedAt: createdAt,
    };
  });

export const NEXT_SERIAL = SEED.length + 1;
