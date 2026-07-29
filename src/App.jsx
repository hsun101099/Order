import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CloudOff, Loader2 } from 'lucide-react';
import TopBar from './components/TopBar.jsx';
import Toast from './components/Toast.jsx';
import OrderPage from './pages/OrderPage.jsx';
import SummaryPage from './pages/SummaryPage.jsx';
import { useOrders } from './hooks/useOrders.js';

export default function App() {
  const { orders, tally, loading, error, offline, writeError, source, addOrder, removeOrder, resetOrders } =
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

  // 背景寫入失敗（例如安全規則不符）時，那筆餐點會被 Firestore 回滾，
  // 因此一定要主動告知，不能讓它安靜消失。
  useEffect(() => {
    if (!writeError) return;
    setToast({
      title: '餐點沒有送出去',
      description:
        writeError.code === 'permission-denied'
          ? 'Firestore 安全規則拒絕了這筆資料，請確認規則已更新。'
          : '請檢查網路後再試一次。',
      tone: 'info',
    });
  }, [writeError]);

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

        {writeError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-danger ring-1 ring-inset ring-rose-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              最後一筆餐點沒有成功送出，已經被系統退回。
              <span className="mt-0.5 block text-xs text-danger/80">
                {writeError.code === 'permission-denied'
                  ? 'Firestore 安全規則拒絕了這筆資料（欄位或份數不符），請更新規則後重新點一次。'
                  : `錯誤代碼：${writeError.code ?? '未知'}`}
              </span>
            </span>
          </div>
        )}

        {!error && !writeError && offline && source === 'firebase' && (
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
            offline={offline}
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
