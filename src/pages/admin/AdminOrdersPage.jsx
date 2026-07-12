import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { OrderStatusBadge } from '../../components/OrderStatusBadge.jsx';
import { Seo } from '../../components/Seo.jsx';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    const response = await api.get('/admin/orders');
    setOrders(response.data.orders || []);
  };

  useEffect(() => {
    loadOrders().catch(() => setError('Orders could not be loaded.'));
  }, []);

  const deleteOrder = async (id) => {
    try {
      setError('');
      await api.delete(`/admin/orders/${id}`);
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete order.');
    }
  };

  return (
    <>
      <Seo title="Admin Orders" description="Manage order statuses." />
      <SectionHeading eyebrow="Order management" title="Orders" />
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <GlassCard key={order._id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-2xl">{order.orderNumber}</p>
                <p className="text-sm text-white/65">Rs. {order.total}</p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <select
                  value={order.status}
                  onChange={(event) =>
                    api.patch(`/orders/${order._id}/status`, { status: event.target.value }).then(() => loadOrders())
                  }
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  type="button"
                  onClick={() => deleteOrder(order._id)}
                  className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                >
                  Delete
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
