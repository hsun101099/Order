import { useCallback, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Toast from './components/Toast.jsx';
import OrderDrawer from './components/OrderDrawer.jsx';
import OrderPage from './pages/OrderPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { isDelayed } from './components/OrderTable.jsx';
import { useOrders } from './hooks/useOrders.js';

const PAGE_META = {
  order: { title: '我要點餐', subtitle: '選擇餐點與飲料，填寫姓名即可完成' },
  dashboard: { title: '訂單總覽', subtitle: '即時掌握每一筆訂單的狀態與進度' },
};

export default function App() {
  const { orders, stats, addOrder, updateOrder, advanceOrder, cancelOrder, resetOrders } = useOrders();
  const [page, setPage] = useState('order');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedId) ?? null,
    [orders, selectedId]
  );

  const notificationCount = useMemo(() => {
    const now = Date.now();
    return orders.filter((order) => isDelayed(order, now)).length;
  }, [orders]);

  const handleSubmitOrder = useCallback(
    (payload) => {
      const order = addOrder(payload);
      setToast({
        title: `訂單 ${order.code} 已送出`,
        description: `${order.customerName} · 感謝您的訂購`,
      });
      return order;
    },
    [addOrder]
  );

  const handleAdvance = useCallback(
    (id) => {
      advanceOrder(id);
      setToast({ title: '訂單狀態已更新', description: '流程已推進至下一階段。', tone: 'info' });
    },
    [advanceOrder]
  );

  const handleCancel = useCallback(
    (id) => {
      cancelOrder(id);
      setToast({ title: '訂單已取消', description: '此筆訂單不列入營業額。', tone: 'info' });
    },
    [cancelOrder]
  );

  const handleSaveNote = useCallback(
    (id, note) => {
      updateOrder(id, { note });
      setToast({ title: '備註已儲存', tone: 'info' });
    },
    [updateOrder]
  );

  const handleReset = useCallback(() => {
    resetOrders();
    setSelectedId(null);
    setToast({ title: '已重設為展示資料', tone: 'info' });
  }, [resetOrders]);

  const meta = PAGE_META[page];

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        current={page}
        onNavigate={setPage}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="lg:pl-64">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          notificationCount={notificationCount}
          onOpenMenu={() => setMobileNavOpen(true)}
        />

        <main className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8 sm:py-8">
          {page === 'order' ? (
            <OrderPage onSubmit={handleSubmitOrder} onNavigate={setPage} />
          ) : (
            <DashboardPage
              orders={orders}
              stats={stats}
              onSelectOrder={(order) => setSelectedId(order.id)}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      <OrderDrawer
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedId(null)}
        onAdvance={handleAdvance}
        onCancel={handleCancel}
        onSaveNote={handleSaveNote}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
