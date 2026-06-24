import { useEffect, useState } from 'react';
import { orderService } from '../services/orderService.js';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { OrderStatusBadge } from '../components/OrderStatusBadge.jsx';
import { Seo } from '../components/Seo.jsx';

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  useEffect(() => {
    orderService.getMyOrders().then((response) => setOrders(response.data.orders || [])).catch(() => setOrders([]));
  }, []);

  const downloadInvoice = async (orderId) => {
    const response = await orderService.downloadInvoice(orderId);
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zaika-invoice.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const trackOrder = async () => {
    if (!trackingNumber) return;
    const response = await orderService.trackOrder(trackingNumber);
    setTrackingResult(response.data);
  };

  return (
    <>
      <Seo title="Orders" description="Track your Zaika Restaurant order history." />
      <SectionHeading eyebrow="Orders" title="Order history" />
      <GlassCard className="mt-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Track order</p>
        <div className="flex flex-wrap gap-3">
          <input
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Enter order number"
            className="min-w-72 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
          />
          <Button onClick={trackOrder} className="bg-gold text-surface-900 hover:bg-[#efcf88]">
            Track
          </Button>
        </div>
        {trackingResult ? (
          <p className="text-sm text-white/70">
            Current status: <span className="text-gold">{trackingResult.status}</span>
          </p>
        ) : null}
      </GlassCard>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <GlassCard key={order._id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-2xl">{order.orderNumber}</p>
                <p className="mt-1 text-sm text-white/65">Rs. {order.total}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <Button
                  onClick={() => downloadInvoice(order._id)}
                  className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  Download invoice
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
