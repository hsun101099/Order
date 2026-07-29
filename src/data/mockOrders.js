import { findDrink, findMeal } from './menu.js';

/**
 * 展示用資料：一群人今天點的餐。
 * minutesAgo 為「距今幾分鐘點的」，讓每次開啟時間都是相對新鮮的。
 */
const SEED = [
  { name: '林宜蓁', mealId: 'cheese-beef', drinkId: 'soda', minutesAgo: 96, note: '起司加量' },
  { name: '陳柏睿', mealId: 'spicy-chicken', drinkId: 'unsweetened-tea', minutesAgo: 91, note: '不要太辣' },
  { name: '黃思穎', mealId: 'bbq-pork', drinkId: 'soda', minutesAgo: 84, note: '' },
  { name: '張家瑋', mealId: 'peanut-beef', drinkId: 'unsweetened-tea', minutesAgo: 76, note: '花生醬另外附' },
  { name: '吳沛慈', mealId: 'cheese-beef', drinkId: 'unsweetened-tea', minutesAgo: 70, note: '' },
  { name: '蔡欣妤', mealId: 'bbq-pork', drinkId: 'unsweetened-tea', minutesAgo: 61, note: '醬料減量' },
  { name: '鄭皓宇', mealId: 'peanut-beef', drinkId: 'soda', minutesAgo: 54, note: '' },
  { name: '許雅琳', mealId: 'cheese-beef', drinkId: 'soda', minutesAgo: 47, note: '' },
  { name: '洪千惠', mealId: 'bbq-pork', drinkId: 'soda', minutesAgo: 38, note: '' },
  { name: '曾語彤', mealId: 'peanut-beef', drinkId: 'unsweetened-tea', minutesAgo: 30, note: '飲料去冰' },
  { name: '王柏勛', mealId: 'cheese-beef', drinkId: 'unsweetened-tea', minutesAgo: 22, note: '' },
  { name: '李孟璇', mealId: 'spicy-chicken', drinkId: 'soda', minutesAgo: 16, note: '加辣' },
  { name: '周佳蓉', mealId: 'bbq-pork', drinkId: 'unsweetened-tea', minutesAgo: 11, note: '' },
  { name: '徐立宸', mealId: 'peanut-beef', drinkId: 'soda', minutesAgo: 6, note: '' },
  { name: '賴宣妤', mealId: 'spicy-chicken', drinkId: 'unsweetened-tea', minutesAgo: 2, note: '' },
];

export const calcTotal = (mealId, drinkId) =>
  (findMeal(mealId)?.price ?? 0) + (findDrink(drinkId)?.price ?? 0);

export const createMockOrders = (now = Date.now()) =>
  SEED.map((seed, index) => ({
    id: `mock-${index + 1}`,
    customerName: seed.name,
    mealId: seed.mealId,
    drinkId: seed.drinkId,
    note: seed.note,
    total: calcTotal(seed.mealId, seed.drinkId),
    createdAt: new Date(now - seed.minutesAgo * 60 * 1000).toISOString(),
  }));
