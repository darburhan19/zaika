import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, CalendarCheck2, Tag, LogOut, Grid2X2, Ticket } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Button } from '../components/ui.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Menu', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Grid2X2 },
  { to: '/admin/orders', label: 'Orders', icon: Tag },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck2 },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/customers', label: 'Customers', icon: Users }
];

export function AdminLayout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="min-h-screen bg-surface-900 text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Zaika Admin</p>
            <h1 className="mt-2 font-display text-3xl">Command Center</h1>
          </div>
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  end={link.end}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                      isActive ? 'bg-gold/15 text-gold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
          <Button
            onClick={clearAuth}
            className="mt-6 w-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </Button>
        </aside>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl md:p-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
