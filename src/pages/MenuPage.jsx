import { useEffect, useMemo, useState } from 'react';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { FoodCard } from '../components/FoodCard.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { productService } from '../services/productService.js';
import { featuredDishes } from '../data/mockData.js';
import { useCartStore } from '../store/useCartStore.js';

export function MenuPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    Promise.allSettled([productService.getCategories(), productService.getProducts()])
      .then(([catResult, productResult]) => {
        if (catResult.status === 'fulfilled') setCategories(catResult.value.data.categories || []);
        if (productResult.status === 'fulfilled') setProducts(productResult.value.data.products || []);
        if (productResult.status !== 'fulfilled') {
          setProducts(
            featuredDishes.map((item, index) => ({
              ...item,
              _id: item.id,
              slug: item.id,
              images: [item.image],
              category: { name: ['Signature', 'Chef Special', 'Vegetarian'][index] }
            }))
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === 'all' || product.category?._id === category || product.category?.name === category;
      const matchesQuery = `${product.name} ${product.description}`.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, category, debouncedQuery]);

  return (
    <>
      <Seo title="Menu" description="Browse premium Kashmiri dishes and add them to your cart." />
      <SectionHeading
        eyebrow="Menu"
        title="Explore our curated menu"
        description="Search dishes, filter by category, and place your order with a luxury dining feel."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search dishes..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
        />
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setCategory('all')} className={`rounded-full px-4 py-3 text-sm ${category === 'all' ? 'bg-gold text-surface-900' : 'bg-white/5 text-white/70'}`}>
            All
          </button>
          {categories.map((item) => (
            <button
              key={item._id}
              onClick={() => setCategory(item._id)}
              className={`rounded-full px-4 py-3 text-sm whitespace-nowrap ${category === item._id ? 'bg-gold text-surface-900' : 'bg-white/5 text-white/70'}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <GlassCard className="md:col-span-2 xl:col-span-3">Loading menu...</GlassCard>
        ) : visibleProducts.length ? (
          visibleProducts.map((product) => (
            <FoodCard key={product._id || product.id} product={product} onAdd={(item) => addItem(item, 1)} />
          ))
        ) : (
          <GlassCard className="md:col-span-2 xl:col-span-3">No dishes found.</GlassCard>
        )}
      </div>
      <div className="mt-10 flex justify-center">
        <Button asChild className="bg-gold text-surface-900 hover:bg-[#efcf88]">
          <a href="/cart">View cart</a>
        </Button>
      </div>
    </>
  );
}
