import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import { GlassCard, SectionHeading } from '../../components/ui.jsx';
import { InfoCard } from '../../components/InfoCard.jsx';
import { Seo } from '../../components/Seo.jsx';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, customers: 0, reservations: 0, revenue: 0 });

  useEffect(() => {
    adminService.dashboard().then((response) => setStats(response.data.stats)).catch(() => null);
  }, []);

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage Zaika Restaurant operations." />
      <SectionHeading eyebrow="Dashboard" title="Analytics overview" />
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <InfoCard title="Revenue" value={`Rs. ${stats.revenue}`} />
        <InfoCard title="Orders" value={stats.orders} />
        <InfoCard title="Customers" value={stats.customers} />
        <InfoCard title="Reservations" value={stats.reservations} />
      </div>
      <GlassCard className="mt-6">Admin insights and performance charts can be added here.</GlassCard>
    </>
  );
}
