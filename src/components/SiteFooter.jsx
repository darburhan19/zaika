import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-3xl">Zaika Restaurant</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
            A premium Kashmiri dining and ordering experience from Handwara, Jammu & Kashmir.
          </p>
        </div>
        <div className="space-y-4 text-sm text-white/75">
          <p className="flex items-center gap-3"><MapPin size={16} className="text-gold" /> Handwara, Jammu & Kashmir, India</p>
          <p className="flex items-center gap-3"><Phone size={16} className="text-gold" /> +91 70000 00000</p>
          <p className="flex items-center gap-3"><Mail size={16} className="text-gold" /> hello@zaikarestaurant.in</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 hover:bg-white/5" to="/menu">
            Menu
          </Link>
          <Link className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 hover:bg-white/5" to="/reservations">
            Reservations
          </Link>
          <a className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 hover:bg-white/5" href="https://instagram.com" target="_blank" rel="noreferrer">
            <Instagram size={16} className="mr-2 inline" />
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
