import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, PartyPopper, User } from 'lucide-react';
import StepIndicator from '../components/StepIndicator.jsx';
import OptionCard from '../components/OptionCard.jsx';
import { DRINKS, MEALS, findDrink, findMeal } from '../data/menu.js';
import { formatCurrency } from '../utils/format.js';

const STEPS = [
  { id: 'meal', label: '選餐點' },
  { id: 'drink', label: '選飲料' },
  { id: 'name', label: '寫名字' },
];

const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

/** 底部一直看得到的選擇摘要，取代側邊的訂單明細表。 */
function ChoiceBar({ mealId, drinkId }) {
  const meal = findMeal(mealId);
  const drink = findDrink(drinkId);
  const total = (meal?.price ?? 0) + (drink?.price ?? 0);

  if (!meal && !drink) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="flex items-center justify-between gap-3 rounded-full bg-white px-5 py-3 shadow-card ring-1 ring-slate-200/70"
    >
      <span className="truncate text-sm text-ink-500">
        {[meal?.name, drink?.name].filter(Boolean).join(' · ')}
      </span>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-900">
        {formatCurrency(total)}
      </span>
    </motion.div>
  );
}

function DonePanel({ order, onReset, onViewSummary }) {
  const meal = findMeal(order.mealId);
  const drink = findDrink(order.drinkId);

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

      <h2 className="mt-5 text-xl font-semibold tracking-tight text-ink-900">
        {order.customerName}，記好了！
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        {meal?.name} 配 {drink?.name} · {formatCurrency(order.total)}
      </p>

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onViewSummary}
          className="focus-ring flex-1 rounded-full bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          看大家點了什麼
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
  const [mealId, setMealId] = useState(null);
  const [drinkId, setDrinkId] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(mealId);
    if (step === 1) return Boolean(drinkId);
    return customerName.trim().length > 0;
  }, [step, mealId, drinkId, customerName]);

  /** 選好之後自動往下一步，少按一次按鈕。 */
  const selectAndAdvance = (setter) => (id) => {
    setter(id);
    setTimeout(() => setStep((prev) => Math.min(STEPS.length - 1, prev + 1)), 260);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    if (!customerName.trim()) {
      setError('填一下名字，才知道這份是誰的。');
      return;
    }
    setPlacedOrder(onSubmit({ customerName, mealId, drinkId, note }));
  };

  const resetFlow = () => {
    setPlacedOrder(null);
    setStep(0);
    setMealId(null);
    setDrinkId(null);
    setCustomerName('');
    setNote('');
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
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">今天想吃哪一個？</h2>
              <p className="mt-1.5 text-sm text-ink-400">四款主餐，一人一份。</p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {MEALS.map((meal, index) => (
                  <OptionCard
                    key={meal.id}
                    option={meal}
                    index={index}
                    selected={mealId === meal.id}
                    onSelect={selectAndAdvance(setMealId)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">配什麼喝的？</h2>
              <p className="mt-1.5 text-sm text-ink-400">每份餐點搭一杯。</p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {DRINKS.map((drink, index) => (
                  <OptionCard
                    key={drink.id}
                    option={drink}
                    index={index}
                    selected={drinkId === drink.id}
                    onSelect={selectAndAdvance(setDrinkId)}
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

                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={2}
                  placeholder="想備註什麼？例如：不要洋蔥、飲料去冰（可略過）"
                  className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all duration-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
              </div>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <ChoiceBar mealId={mealId} drinkId={drinkId} />

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
          disabled={!canContinue}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400 disabled:hover:translate-y-0"
        >
          {step === STEPS.length - 1 ? (
            <>
              <Check className="h-4 w-4" />
              就這樣
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
