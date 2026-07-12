import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button, GlassCard } from './ui.jsx';

export function FoodCard({ product, onAdd }) {
  const image = product.images?.[0] || product.image;
  const price = product.discountedPrice || product.price;
  function getCategoryLabel(cat) {
    if (!cat) return 'Zaika';
    if (typeof cat === 'string') return cat;
    if (typeof cat === 'object') {
      if (typeof cat.name === 'string') return cat.name;
      // nested object with name field that's an object
      if (cat.name && typeof cat.name === 'object') {
        return cat.name.name || JSON.stringify(cat.name);
      }
      return JSON.stringify(cat);
    }
    return String(cat);
  }

  return (
    <GlassCard className="group overflow-hidden p-0">
      <motion.div whileHover={{ y: -6 }} className="h-full">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect fill='%23222' width='100%' height='100%'/><text x='50%' y='50%' fill='%23fff' font-size='24' text-anchor='middle' dominant-baseline='middle'>Image unavailable</text></svg>";
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
            {getCategoryLabel(product.category)}
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <h3 className="font-display text-2xl text-white">{product.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">{product.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Price</p>
              <p className="mt-1 text-xl font-semibold text-gold">Rs. {price}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link to={`/food/${product.slug || product.id || product._id}`}>View</Link>
              </Button>
              <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link to="/reservations">Book table</Link>
              </Button>
              <button
                onClick={() => onAdd?.(product)}
                className="grid h-11 w-11 place-items-center rounded-full bg-gold text-surface-900 transition hover:bg-[#efcf88]"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
