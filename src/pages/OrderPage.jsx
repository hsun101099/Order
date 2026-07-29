import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, PartyPopper, User } from 'lucide-react';
import StepIndicator from '../components/StepIndicator.jsx';
import OptionCard from '../components/OptionCard.jsx';
import { DRINKS, MEALS, PORTIONS_PER_PERSON, findDrink, findMeal } from '../data/menu.js';

const STEPS = [
  { id: 'meal', label: '選餐點' },
  { id: 'drink', label: '選飲料' },
  { id: 'name', label: '寫名字' },
];

const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

const countOf = (quantities) => Object.values(quantities).reduce((sum, value) => sum + value, 0);

/** { 'cheese-beef': 2 } → ['cheese-beef', 'cheese-beef'] */
const toList = (quantities) =>
  Object.entries(quantities).flatMap(([id, quantity]) => Array.from({ length: quantity }, () => id));

const describe = (ids, finder) => {
  const counted = ids.reduce((acc, id) => ({ ...acc, [id]: (acc[id] ?? 0) + 1 }), {});
  return Object.entries(counted)
    .map(([id, quantity]) => `${finder(id)?.name ?? id}${quantity > 1 ? ` ×${quantity}` : ''}`)
    .join('、');
};

/** 底部一直看得到的選擇摘要。 */
function ChoiceBar({ mealIds, drinkIds }) {
  if (mealIds.length === 0 && drinkIds.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="flex items-center justify-between gap-3 rounded-full bg-white px-5 py-3 shadow-card ring-1 ring-slate-200/70"
    >
      <span className="truncate text-sm text-ink-500">
        {[
          mealIds.length ? describe(mealIds, findMeal) : null,
          drinkIds.length ? describe(drinkIds, findDrink) : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      </span>
    </motion.div>
  );
}

/** 目前選了幾份 / 還差幾份。 */
function PortionCounter({ selected }) {
  const full = selected === PORTIONS_PER_PERSON;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${
        full ? 'bg-emerald-50 text-success' : 'bg-slate-100 text-ink-500'
      }`}
    >
      {full && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      已選 {selected} / {PORTIONS_PER_PERSON} 份
    </span>
  );
}

function DonePanel({ order, onReset, onViewSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="mx-auto max-w-md rounded-[24px] border border-slate-200/70 bg-white p-8 text-center shadow-card"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-success"
      >
        <PartyPopper className="h-7 w-7" />
      </motion.span>

      <h2 className="mt-5 text-xl font-semibold tracking-tight text-ink-900">點餐完成</h2>
      <p className="mt-1.5 text-sm text-ink-500">{order.customerName}，你的餐點已經送出。</p>

      <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-4 text-sm leading-relaxed text-ink-700">
        {describe(order.meals, findMeal)}
        <br />
        {describe(order.drinks, findDrink)}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        到「大家點的」就能看到自己在清單裡，代表確實點成功了。
      </p>

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onViewSummary}
          className="focus-ring flex-1 rounded-full bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          到「大家點的」確認
        </button>
        <button
          type="button"
          onClick={onReset}
          className="focus-ring flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-slate-50"
        >
          幫別人點
        </button>
      </div>
    </motion.div>
  );
}

export default function OrderPage({ onSubmit, onNavigate }) {
  const [step, setStep] = useState(0);
  const [mealQuantities, setMealQuantities] = useState({});
  const [drinkQuantities, setDrinkQuantities] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const mealCount = countOf(mealQuantities);
  const drinkCount = countOf(drinkQuantities);
  const mealIds = useMemo(() => toList(mealQuantities), [mealQuantities]);
  const drinkIds = useMemo(() => toList(drinkQuantities), [drinkQuantities]);

  const canContinue = useMemo(() => {
    if (step === 0) return mealCount === PORTIONS_PER_PERSON;
    if (step === 1) return drinkCount === PORTIONS_PER_PERSON;
    return customerName.trim().length > 0;
  }, [step, mealCount, drinkCount, customerName]);

  /**
   * 份數更新；超過上限的操作會被忽略，選滿之後自動前往下一步。
   * 計算與排程都放在事件處理器裡，避免在 state updater 內產生副作用。
   */
  const updateQuantity = (quantities, setter, stepIndex) => (id, quantity) => {
    if (quantity < 0) return;

    const next = { ...quantities };
    if (quantity === 0) delete next[id];
    else next[id] = quantity;

    const total = countOf(next);
    if (total > PORTIONS_PER_PERSON) return;

    setter(next);

    if (total === PORTIONS_PER_PERSON) {
      // 只有在使用者仍停留在這一步時才前進，避免手動返回後又被推走。
      setTimeout(
        () => setStep((current) => (current === stepIndex ? current + 1 : current)),
        320
      );
    }
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    if (!customerName.trim()) {
      setError('填一下名字，才知道這份是誰的。');
      return;
    }

    setSubmitting(true);
    try {
      setPlacedOrder(await onSubmit({ customerName, meals: mealIds, drinks: drinkIds }));
    } catch {
      setError('送出失敗，請再試一次。');
    } finally {
      setSubmitting(false);
    }
  };

  const resetFlow = () => {
    setPlacedOrder(null);
    setStep(0);
    setMealQuantities({});
    setDrinkQuantities({});
    setCustomerName('');
    setError('');
  };

  if (placedOrder) {
    return (
      <DonePanel
        order={placedOrder}
        onReset={resetFlow}
        onViewSummary={() => onNavigate('summary')}
      />
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <StepIndicator steps={STEPS} current={step} />

      <AnimatePresence mode="wait">
        <motion.section
          key={STEPS[step].id}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={transition}
        >
          {step === 0 && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                  今天想吃哪兩份？
                </h2>
                <PortionCounter selected={mealCount} />
              </div>
              <p className="mt-1.5 text-sm text-ink-400">
                每個人固定 {PORTIONS_PER_PERSON} 份，同一款可以點兩份。
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {MEALS.map((meal, index) => (
                  <OptionCard
                    key={meal.id}
                    option={meal}
                    index={index}
                    quantity={mealQuantities[meal.id] ?? 0}
                    canAdd={mealCount < PORTIONS_PER_PERSON}
                    onChange={updateQuantity(mealQuantities, setMealQuantities, 0)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900">配哪兩杯？</h2>
                <PortionCounter selected={drinkCount} />
              </div>
              <p className="mt-1.5 text-sm text-ink-400">
                兩份餐點各搭一杯，兩杯可以一樣。
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {DRINKS.map((drink, index) => (
                  <OptionCard
                    key={drink.id}
                    option={drink}
                    index={index}
                    quantity={drinkQuantities[drink.id] ?? 0}
                    canAdd={drinkCount < PORTIONS_PER_PERSON}
                    onChange={updateQuantity(drinkQuantities, setDrinkQuantities, 1)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">你的名字是？</h2>
              <p className="mt-1.5 text-sm text-ink-400">餐到了才知道要找誰。</p>

              <div className="mt-6 rounded-[24px] border border-slate-200/70 bg-white p-6 shadow-card">
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(event) => {
                      setCustomerName(event.target.value);
                      setError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && canContinue) handleNext();
                    }}
                    placeholder="輸入名字"
                    maxLength={20}
                    autoFocus
                    className={`w-full rounded-full border bg-white py-3.5 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all duration-200 focus:ring-4 ${
                      error
                        ? 'border-rose-300 focus:border-danger focus:ring-rose-100'
                        : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100'
                    }`}
                  />
                </div>
                {error && <p className="mt-2 px-2 text-xs text-danger">{error}</p>}

              </div>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <ChoiceBar mealIds={mealIds} drinkIds={drinkIds} />

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(0, prev - 1))}
          disabled={step === 0}
          className="focus-ring inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-ink-500 transition-colors hover:bg-slate-100 hover:text-ink-900 disabled:cursor-not-allowed disabled:text-ink-400 disabled:hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          上一步
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue || submitting}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400 disabled:hover:translate-y-0"
        >
          {step === STEPS.length - 1 ? (
            <>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {submitting ? '送出中…' : '就這樣'}
            </>
          ) : (
            <>
              下一步
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
