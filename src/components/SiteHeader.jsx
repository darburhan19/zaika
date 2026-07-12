import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore.js';
import { Button } from './ui.jsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const cartCount = useCartStore((state) => state.itemCount());

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-surface-900/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold shadow-glow">
            <Crown size={18} />
          </span>
          <div>
            <p className="font-display text-2xl leading-none">Zaika</p>
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">Restaurant</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition ${isActive ? 'text-gold' : 'text-white/70 hover:text-white'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild className="border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20">
            <Link to="/cart">
              <ShoppingBag size={16} className="mr-2" />
              Cart ({cartCount})
            </Link>
          </Button>
          <Button asChild className="bg-gold text-surface-900 hover:bg-[#efcf88]">
            <Link to="/reservations">Book now</Link>
          </Button>
          <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link to="/register">Register</Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/10 bg-surface-900/95 px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-white/75 hover:bg-white/5">
                {link.label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-white/75 hover:bg-white/5">
              Cart ({cartCount})
            </Link>
            <Link to="/reservations" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-white/75 hover:bg-white/5">
              Book now
            </Link>
            <Link to="/register" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-white/75 hover:bg-white/5">
              Register
            </Link>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}
