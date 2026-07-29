import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper, Receipt, User } from 'lucide-react';
import StepIndicator from '../components/StepIndicator.jsx';
import OptionCard from '../components/OptionCard.jsx';
import { DRINKS, MEALS, findDrink, findMeal } from '../data/menu.js';
import { formatCurrency } from '../utils/format.js';

const STEPS = [
  { id: 'meal', label: '選擇餐點' },
  { id: 'drink', label: '選擇飲料' },
  { id: 'name', label: '填寫姓名' },
];

const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

function SummaryPanel({ mealId, drinkId, customerName }) {
  const meal = findMeal(mealId);
  const drink = findDrink(drinkId);
  const total = (meal?.price ?? 0) + (drink?.price ?? 0);

  const rows = [
    { label: '餐點', value: meal?.name, price: meal?.price },
    { label: '飲料', value: drink?.name, price: drink?.price },
  ];

  return (
    <aside className="card sticky top-24 self-start p-5">
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-ink-400" />
        <h2 className="text-sm font-semibold text-ink-900">訂單摘要</h2>
      </div>

      <p className="mt-1 text-xs text-ink-400">一份餐點搭配一杯飲料</p>

      <dl className="mt-5 flex flex-col gap-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-ink-400">{row.label}</dt>
            <dd className={row.value ? 'font-medium text-ink-900' : 'text-ink-400'}>
              {row.value ? `${row.value} · ${formatCurrency(row.price)}` : '尚未選擇'}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 text-sm">
          <dt className="text-ink-400">姓名</dt>
          <dd className={customerName ? 'font-medium text-ink-900' : 'text-ink-400'}>
            {customerName || '尚未填寫'}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-baseline justify-between border-t border-dashed border-slate-200 pt-4">
        <span className="text-sm text-ink-500">合計</span>
        <motion.span
          key={total}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="text-2xl font-semibold tracking-tight text-ink-900 tabular-nums"
        >
          {formatCurrency(total)}
        </motion.span>
      </div>
    </aside>
  );
}

function SuccessPanel({ order, onReset, onViewDashboard }) {
  const meal = findMeal(order.mealId);
  const drink = findDrink(order.drinkId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="card mx-auto max-w-lg p-8 text-center"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-success"
      >
        <PartyPopper className="h-7 w-7" />
      </motion.span>

      <h2 className="mt-5 text-xl font-semibold tracking-tight text-ink-900">點餐完成！</h2>
      <p className="mt-1.5 text-sm text-ink-500">
        {order.customerName}，您的餐點已送出，請留意叫號。
      </p>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-400">訂單編號</span>
          <span className="font-mono text-sm font-semibold text-ink-900">{order.code}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-ink-400">餐點內容</span>
          <span className="text-sm font-medium text-ink-900">
            {meal?.name} · {drink?.name}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-3">
          <span className="text-xs text-ink-400">應付金額</span>
          <span className="text-base font-semibold tabular-nums text-ink-900">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="focus-ring flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20"
        >
          再點一份
        </button>
        <button
          type="button"
          onClick={onViewDashboard}
          className="focus-ring flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-slate-50"
        >
          查看訂單總覽
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

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    if (!customerName.trim()) {
      setError('請輸入姓名，方便我們叫號。');
      return;
    }
    const order = onSubmit({ customerName, mealId, drinkId, note });
    setPlacedOrder(order);
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
      <SuccessPanel
        order={placedOrder}
        onReset={resetFlow}
        onViewDashboard={() => onNavigate('dashboard')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col gap-6">
        <div className="card p-5">
          <StepIndicator steps={STEPS} current={step} />
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={STEPS[step].id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={transition}
          >
            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-ink-900">選擇一份主餐</h2>
                <p className="mt-1 text-sm text-ink-400">四款招牌，每人限選一份。</p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {MEALS.map((meal, index) => (
                    <OptionCard
                      key={meal.id}
                      option={meal}
                      index={index}
                      selected={mealId === meal.id}
                      onSelect={setMealId}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-ink-900">選擇一杯飲料</h2>
                <p className="mt-1 text-sm text-ink-400">每份餐點搭配一杯飲料。</p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {DRINKS.map((drink, index) => (
                    <OptionCard
                      key={drink.id}
                      option={drink}
                      index={index}
                      selected={drinkId === drink.id}
                      onSelect={setDrinkId}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-ink-900">填寫取餐姓名</h2>
                <p className="mt-1 text-sm text-ink-400">餐點完成時我們會以姓名叫號。</p>

                <div className="card mt-5 p-6">
                  <label htmlFor="customer-name" className="block text-sm font-medium text-ink-700">
                    姓名 <span className="text-danger">*</span>
                  </label>
                  <div className="relative mt-2">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
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
                      placeholder="請輸入您的姓名"
                      maxLength={20}
                      autoFocus
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all duration-200 focus:ring-4 ${
                        error
                          ? 'border-rose-300 focus:border-danger focus:ring-rose-100'
                          : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100'
                      }`}
                    />
                  </div>
                  {error && <p className="mt-2 text-xs text-danger">{error}</p>}

                  <label htmlFor="customer-note" className="mt-6 block text-sm font-medium text-ink-700">
                    備註 <span className="text-ink-400">（選填）</span>
                  </label>
                  <textarea
                    id="customer-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    placeholder="例如：不要洋蔥、飲料去冰…"
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all duration-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-ink-400 disabled:hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            上一步
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canContinue}
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400 disabled:shadow-none"
          >
            {step === STEPS.length - 1 ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                送出訂單
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

      <SummaryPanel mealId={mealId} drinkId={drinkId} customerName={customerName.trim()} />
    </div>
  );
}
