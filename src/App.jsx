import { useCallback, useState } from 'react';
import { CloudOff, Loader2 } from 'lucide-react';
import TopBar from './components/TopBar.jsx';
import Toast from './components/Toast.jsx';
import OrderPage from './pages/OrderPage.jsx';
import SummaryPage from './pages/SummaryPage.jsx';
import { useOrders } from './hooks/useOrders.js';

export default function App() {
  const { orders, tally, loading, error, offline, source, addOrder, removeOrder, resetOrders } =
    useOrders();
  const [page, setPage] = useState('order');
  const [toast, setToast] = useState(null);

  const handleSubmitOrder = useCallback(
    async (payload) => {
      const order = await addOrder(payload);
      setToast({ title: `${order.customerName} 的餐點已加入`, description: '大家的統整已更新。' });
      return order;
    },
    [addOrder]
  );

  const handleRemove = useCallback(
    async (id) => {
      const target = orders.find((order) => order.id === id);
      await removeOrder(id);
      setToast({ title: `已移除${target ? ` ${target.customerName} 的餐點` : ''}`, tone: 'info' });
    },
    [orders, removeOrder]
  );

  const handleReset = useCallback(async () => {
    await resetOrders();
    setToast({ title: '已重新開始一輪', tone: 'info' });
  }, [resetOrders]);

  return (
    <div className="min-h-screen bg-canvas">
      <TopBar page={page} onNavigate={setPage} count={orders.length} />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-4 sm:px-6 sm:pt-6">
        {error && (
          <p className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-danger ring-1 ring-inset ring-rose-100">
            資料讀取失敗，請確認 Firebase 設定與網路狀態。
          </p>
        )}

        {!error && offline && source === 'firebase' && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-inset ring-amber-100">
            <CloudOff className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              尚未連上 Firestore，目前顯示的是本機快取，點的餐不會同步給其他人。
              <span className="mt-0.5 block text-xs text-amber-600/80">
                請確認 Firebase Console 已建立 Firestore 資料庫，以及目前的網路狀態。
              </span>
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-ink-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            載入中…
          </div>
        ) : page === 'order' ? (
          <OrderPage onSubmit={handleSubmitOrder} onNavigate={setPage} />
        ) : (
          <SummaryPage
            orders={orders}
            tally={tally}
            source={source}
            onRemove={handleRemove}
            onReset={handleReset}
            onNavigate={setPage}
            onNotify={setToast}
          />
        )}
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
