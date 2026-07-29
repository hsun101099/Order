import { useCallback, useState } from 'react';
import TopBar from './components/TopBar.jsx';
import Toast from './components/Toast.jsx';
import OrderPage from './pages/OrderPage.jsx';
import SummaryPage from './pages/SummaryPage.jsx';
import { useOrders } from './hooks/useOrders.js';

export default function App() {
  const { orders, tally, addOrder, removeOrder, resetOrders } = useOrders();
  const [page, setPage] = useState('order');
  const [toast, setToast] = useState(null);

  const handleSubmitOrder = useCallback(
    (payload) => {
      const order = addOrder(payload);
      setToast({ title: `${order.customerName} 的餐點已加入`, description: '大家的統整已更新。' });
      return order;
    },
    [addOrder]
  );

  const handleRemove = useCallback(
    (id) => {
      const target = orders.find((order) => order.id === id);
      removeOrder(id);
      setToast({ title: `已移除${target ? ` ${target.customerName} 的餐點` : ''}`, tone: 'info' });
    },
    [orders, removeOrder]
  );

  const handleReset = useCallback(() => {
    resetOrders();
    setToast({ title: '已重新開始一輪', tone: 'info' });
  }, [resetOrders]);

  return (
    <div className="min-h-screen bg-canvas">
      <TopBar page={page} onNavigate={setPage} count={orders.length} />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-4 sm:px-6 sm:pt-6">
        {page === 'order' ? (
          <OrderPage onSubmit={handleSubmitOrder} onNavigate={setPage} />
        ) : (
          <SummaryPage
            orders={orders}
            tally={tally}
            onRemove={handleRemove}
            onReset={handleReset}
            onNavigate={setPage}
          />
        )}
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
