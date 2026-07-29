/**
 * 展示用資料：一群人今天點的餐，每個人固定兩份餐點與兩杯飲料。
 * minutesAgo 為「距今幾分鐘點的」，讓每次開啟時間都是相對新鮮的。
 */
const SEED = [
  {
    name: '林宜蓁',
    meals: ['cheese-beef', 'cheese-beef'],
    drinks: ['soda', 'soda'],
    minutesAgo: 96,
  },
  {
    name: '陳柏睿',
    meals: ['spicy-chicken', 'bbq-pork'],
    drinks: ['unsweetened-tea', 'soda'],
    minutesAgo: 91,
  },
  {
    name: '黃思穎',
    meals: ['bbq-pork', 'peanut-beef'],
    drinks: ['soda', 'unsweetened-tea'],
    minutesAgo: 84,
  },
  {
    name: '張家瑋',
    meals: ['peanut-beef', 'peanut-beef'],
    drinks: ['unsweetened-tea', 'unsweetened-tea'],
    minutesAgo: 76,
  },
  {
    name: '吳沛慈',
    meals: ['cheese-beef', 'spicy-chicken'],
    drinks: ['unsweetened-tea', 'soda'],
    minutesAgo: 70,
  },
  {
    name: '蔡欣妤',
    meals: ['bbq-pork', 'bbq-pork'],
    drinks: ['unsweetened-tea', 'soda'],
    minutesAgo: 61,
  },
  {
    name: '鄭皓宇',
    meals: ['peanut-beef', 'cheese-beef'],
    drinks: ['soda', 'soda'],
    minutesAgo: 54,
  },
  {
    name: '許雅琳',
    meals: ['cheese-beef', 'bbq-pork'],
    drinks: ['soda', 'unsweetened-tea'],
    minutesAgo: 47,
  },
  {
    name: '洪千惠',
    meals: ['bbq-pork', 'spicy-chicken'],
    drinks: ['soda', 'soda'],
    minutesAgo: 38,
  },
  {
    name: '曾語彤',
    meals: ['peanut-beef', 'spicy-chicken'],
    drinks: ['unsweetened-tea', 'unsweetened-tea'],
    minutesAgo: 30,
  },
  {
    name: '王柏勛',
    meals: ['cheese-beef', 'peanut-beef'],
    drinks: ['unsweetened-tea', 'soda'],
    minutesAgo: 22,
  },
  {
    name: '李孟璇',
    meals: ['spicy-chicken', 'spicy-chicken'],
    drinks: ['soda', 'unsweetened-tea'],
    minutesAgo: 16,
  },
];

export const createMockOrders = (now = Date.now()) =>
  SEED.map((seed, index) => ({
    id: `mock-${index + 1}`,
    customerName: seed.name,
    meals: seed.meals,
    drinks: seed.drinks,
    createdAt: new Date(now - seed.minutesAgo * 60 * 1000).toISOString(),
  }));
