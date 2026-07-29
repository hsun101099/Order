import { Beef, Croissant, Drumstick, Flame, CupSoda, Leaf } from 'lucide-react';

/**
 * 餐點清單。
 * 每個人固定點兩份：兩份主餐 + 兩杯飲料（可以重複選同一款）。
 */
export const PORTIONS_PER_PERSON = 2;

export const MEALS = [
  { id: 'cheese-beef', name: '起司牛', tone: 'brand', icon: Beef },
  { id: 'peanut-beef', name: '花生牛', tone: 'amber', icon: Croissant },
  { id: 'bbq-pork', name: 'BBQ 豬', tone: 'rose', icon: Flame },
  { id: 'spicy-chicken', name: '酸辣雞腿', tone: 'emerald', icon: Drumstick },
];

export const DRINKS = [
  { id: 'soda', name: '汽水', tone: 'brand', icon: CupSoda },
  { id: 'unsweetened-tea', name: '無糖茶', tone: 'emerald', icon: Leaf },
];

/** 卡片共用的色彩語彙，避免 Tailwind 動態 class 被 purge。 */
export const TONE_STYLES = {
  brand: { soft: 'bg-brand-50 text-brand-600', bar: 'bg-brand-600' },
  amber: { soft: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500' },
  rose: { soft: 'bg-rose-50 text-rose-600', bar: 'bg-rose-500' },
  emerald: { soft: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-600' },
};

export const findMeal = (id) => MEALS.find((meal) => meal.id === id) ?? null;
export const findDrink = (id) => DRINKS.find((drink) => drink.id === id) ?? null;
