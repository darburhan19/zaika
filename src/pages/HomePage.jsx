import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, UtensilsCrossed, MapPinned, Clock3 } from 'lucide-react';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { heroHighlights, stats, testimonials } from '../data/mockData.js';
import { InfoCard } from '../components/InfoCard.jsx';
import { productService } from '../services/productService.js';
import { galleryService } from '../services/galleryService.js';

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    productService
      .getProducts({ featured: true })
      .then((response) => {
        const products = response.data?.products || [];
        if (!mounted) return;

        setFeaturedProducts(products.slice(0, 6));
      });

    galleryService
      .getGalleryItems()
      .then((response) => {
        if (!mounted) return;
        setGalleryItems((response.data?.items || []).slice(0, 4));
      })
      .catch(() => {
        if (mounted) setGalleryItems([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Seo
        title="Luxury Kashmiri Dining in Handwara"
        description="Order premium Kashmiri food, book tables, and explore Zaika Restaurant's luxury dining experience in Handwara."
      />

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Sparkles size={14} />
            Premium Kashmiri Cuisine
          </p>
          <h1 className="max-w-3xl font-display text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
            Zaika Restaurant, crafted for elegant dining and effortless ordering.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
            A luxury food ordering platform for Handwara with handcrafted Kashmiri flavors,
            table reservations, online payments, and a refined mobile-first experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="bg-gold text-surface-900 hover:bg-[#efcf88]">
              <Link to="/menu">
                Explore Menu <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link to="/reservations">Book a Table</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {heroHighlights.map((item) => (
              <GlassCard key={item} className="p-4 text-sm text-white/75">
                {item}
              </GlassCard>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-gold/20 via-white/5 to-ember/10 blur-2xl" />
          <GlassCard className="overflow-hidden p-0">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80"
              alt="Zaika restaurant banner"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='540'><rect fill='%23222' width='100%' height='100%'/><text x='50%' y='50%' fill='%23fff' font-size='36' text-anchor='middle' dominant-baseline='middle'>Zaika</text></svg>";
              }}
              className="h-[540px] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Signature Dining Experience</p>
              <p className="mt-2 font-display text-3xl text-white">Warm, luxurious, and unforgettable.</p>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section className="mt-20 grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <InfoCard key={stat.label} title={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Featured dishes"
          title="Royal dishes from our kitchen"
          description="Only admin-added dishes appear here."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.length ? (
            featuredProducts.map((dish) => (
              <GlassCard key={dish._id || dish.id} className="overflow-hidden p-0">
                <img
                  src={dish.image || dish.images?.[0]}
                  alt={dish.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='%23222' width='100%' height='100%'/><text x='50%' y='50%' fill='%23fff' font-size='24' text-anchor='middle' dominant-baseline='middle'>Dish image</text></svg>";
                  }}
                  className="h-72 w-full object-cover"
                />
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">{dish.category?.name || dish.category}</p>
                    <h3 className="mt-2 font-display text-3xl">{dish.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/65">{dish.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold text-gold">Rs. {dish.price}</p>
                    <div className="flex gap-3">
                      <Button asChild className="bg-white/5 text-white hover:bg-white/10">
                        <Link to="/menu">Order now</Link>
                      </Button>
                      <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <Link to="/reservations">Book table</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="md:col-span-2 xl:col-span-3">
              No products added by admin yet.
            </GlassCard>
          )}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading eyebrow="Gallery" title="Moments from our kitchen" description="Handpicked images from our dining room and signature plates." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {galleryItems.length ? (
            galleryItems.map((item) => (
              <GlassCard key={item._id} className="overflow-hidden p-0">
                <img src={item.imageUrl} alt={item.altText || item.title || 'Gallery'} className="h-44 w-full object-cover" />
              </GlassCard>
            ))
          ) : (
            <GlassCard>No gallery images yet.</GlassCard>
          )}
        </div>
      </section>

      <section className="mt-24 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Why choose us"
            title="Built for memorable hospitality"
            description="Luxury visuals, quick ordering, secure payments, and customer-first support in one elegant platform."
          />
          <div className="mt-6 space-y-4">
            {[
              ['Fine dining visuals', 'Dark luxury palette with cinematic food presentation.'],
              ['Fast ordering', 'Mobile-first experience with smooth checkout and tracking.'],
              ['Reservation ready', 'Table booking flow for families and events.']
            ].map(([title, desc]) => (
              <GlassCard key={title} className="p-5">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-7 text-white/65">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <GlassCard className="space-y-4">
            <UtensilsCrossed className="text-gold" />
            <p className="font-display text-3xl">Chef led menu</p>
            <p className="text-sm leading-7 text-white/65">Thoughtful Kashmiri and Indian dishes presented with premium styling.</p>
          </GlassCard>
          <GlassCard className="space-y-4">
            <MapPinned className="text-gold" />
            <p className="font-display text-3xl">Handwara presence</p>
            <p className="text-sm leading-7 text-white/65">Built for local delivery, dining, and easy directions on Google Maps.</p>
          </GlassCard>
          <GlassCard className="space-y-4 sm:col-span-2">
            <Clock3 className="text-gold" />
            <p className="font-display text-3xl">Always responsive</p>
            <p className="text-sm leading-7 text-white/65">
              Fast, lightweight, and polished across every screen size.
            </p>
          </GlassCard>
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by guests across Handwara"
          description="A restaurant experience that feels as premium online as it does in person."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <GlassCard key={item.name}>
              <p className="text-lg leading-8 text-white/80">“{item.text}”</p>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] text-gold">{item.name}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-24 rounded-[2rem] border border-white/10 bg-gradient-to-r from-gold/15 via-white/5 to-ember/10 p-8 md:p-12">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Ready to dine?</p>
          <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
            Reserve a table or order online in seconds.
          </h2>
          <p className="mt-4 text-white/70">
            Zaika Restaurant is designed as a complete digital dining platform, from discovery to delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="bg-gold text-surface-900 hover:bg-[#efcf88]">
              <Link to="/reservations">Reserve now</Link>
            </Button>
            <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
