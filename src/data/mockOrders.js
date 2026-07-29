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
    note: '起司加量',
  },
  {
    name: '陳柏睿',
    meals: ['spicy-chicken', 'bbq-pork'],
    drinks: ['unsweetened-tea', 'soda'],
    minutesAgo: 91,
    note: '不要太辣',
  },
  {
    name: '黃思穎',
    meals: ['bbq-pork', 'peanut-beef'],
    drinks: ['soda', 'unsweetened-tea'],
    minutesAgo: 84,
    note: '',
  },
  {
    name: '張家瑋',
    meals: ['peanut-beef', 'peanut-beef'],
    drinks: ['unsweetened-tea', 'unsweetened-tea'],
    minutesAgo: 76,
    note: '花生醬另外附',
  },
  {
    name: '吳沛慈',
    meals: ['cheese-beef', 'spicy-chicken'],
    drinks: ['unsweetened-tea', 'soda'],
    minutesAgo: 70,
    note: '',
  },
  {
    name: '蔡欣妤',
    meals: ['bbq-pork', 'bbq-pork'],
    drinks: ['unsweetened-tea', 'soda'],
    minutesAgo: 61,
    note: '醬料減量',
  },
  {
    name: '鄭皓宇',
    meals: ['peanut-beef', 'cheese-beef'],
    drinks: ['soda', 'soda'],
    minutesAgo: 54,
    note: '',
  },
  {
    name: '許雅琳',
    meals: ['cheese-beef', 'bbq-pork'],
    drinks: ['soda', 'unsweetened-tea'],
    minutesAgo: 47,
    note: '',
  },
  {
    name: '洪千惠',
    meals: ['bbq-pork', 'spicy-chicken'],
    drinks: ['soda', 'soda'],
    minutesAgo: 38,
    note: '',
  },
  {
    name: '曾語彤',
    meals: ['peanut-beef', 'spicy-chicken'],
    drinks: ['unsweetened-tea', 'unsweetened-tea'],
    minutesAgo: 30,
    note: '飲料去冰',
  },
  {
    name: '王柏勛',
    meals: ['cheese-beef', 'peanut-beef'],
    drinks: ['unsweetened-tea', 'soda'],
    minutesAgo: 22,
    note: '',
  },
  {
    name: '李孟璇',
    meals: ['spicy-chicken', 'spicy-chicken'],
    drinks: ['soda', 'unsweetened-tea'],
    minutesAgo: 16,
    note: '加辣',
  },
];

export const createMockOrders = (now = Date.now()) =>
  SEED.map((seed, index) => ({
    id: `mock-${index + 1}`,
    customerName: seed.name,
    meals: seed.meals,
    drinks: seed.drinks,
    note: seed.note,
    createdAt: new Date(now - seed.minutesAgo * 60 * 1000).toISOString(),
  }));
