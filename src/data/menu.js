import { Beef, Croissant, Drumstick, Flame, CupSoda, Leaf } from 'lucide-react';

/**
 * 餐點清單。
 * 每個人固定點兩份：兩份主餐 + 兩杯飲料（可以重複選同一款）。
 */
export const PORTIONS_PER_PERSON = 2;

export const MEALS = [
  {
    id: 'cheese-beef',
    name: '起司牛',
    subtitle: 'Cheese Beef',
    description: '慢燉牛肉搭配雙倍融化起司，鹹香濃郁的經典款。',
    tag: '人氣第一',
    tone: 'brand',
    icon: Beef,
  },
  {
    id: 'peanut-beef',
    name: '花生牛',
    subtitle: 'Peanut Beef',
    description: '手炒花生醬與嫩煎牛肉，帶著堅果甜香的層次口感。',
    tag: '香濃推薦',
    tone: 'amber',
    icon: Croissant,
  },
  {
    id: 'bbq-pork',
    name: 'BBQ 豬',
    subtitle: 'BBQ Pork',
    description: '煙燻炭烤豬肉刷上特調 BBQ 醬，微甜帶著焦香。',
    tag: '炭烤風味',
    tone: 'rose',
    icon: Flame,
  },
  {
    id: 'spicy-chicken',
    name: '酸辣雞腿',
    subtitle: 'Hot & Sour Chicken',
    description: '去骨雞腿排佐酸辣醬汁，開胃且不膩口的清爽選擇。',
    tag: '微辣',
    tone: 'emerald',
    icon: Drumstick,
  },
];

export const DRINKS = [
  {
    id: 'soda',
    name: '汽水',
    subtitle: 'Soda',
    description: '冰鎮氣泡，解膩首選。',
    tone: 'brand',
    icon: CupSoda,
  },
  {
    id: 'unsweetened-tea',
    name: '無糖茶',
    subtitle: 'Unsweetened Tea',
    description: '冷泡青茶，零糖分無負擔。',
    tone: 'emerald',
    icon: Leaf,
  },
];

/** 卡片、Badge 共用的色彩語彙，避免 Tailwind 動態 class 被 purge。 */
export const TONE_STYLES = {
  brand: {
    soft: 'bg-brand-50 text-brand-600',
    ring: 'ring-brand-600',
    dot: 'bg-brand-600',
    bar: 'bg-brand-600',
  },
  amber: {
    soft: 'bg-amber-50 text-amber-600',
    ring: 'ring-amber-500',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  rose: {
    soft: 'bg-rose-50 text-rose-600',
    ring: 'ring-rose-500',
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
  },
  emerald: {
    soft: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-500',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-600',
  },
};

export const findMeal = (id) => MEALS.find((meal) => meal.id === id) ?? null;
export const findDrink = (id) => DRINKS.find((drink) => drink.id === id) ?? null;
