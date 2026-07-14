import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { HeroSlider } from '../components/HeroSlider.jsx';
import { FeaturedDishCard } from '../components/FeaturedDishCard.jsx';
import { heroHighlights } from '../data/mockData.js';
import { galleryService } from '../services/galleryService.js';
import { productService } from '../services/productService.js';

export function HomePage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    let mounted = true;

    productService
      .getProducts({ featured: true })
      .then((response) => {
        if (!mounted) return;
        setFeaturedProducts((response.data?.products || []).slice(0, 6));
      })
      .catch(() => {
        if (mounted) setFeaturedProducts([]);
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
        description="Order premium Kashmiri food, book tables, and explore Zaika Restaurant in Handwara."
      />

      <HeroSlider />

      <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3">
        {heroHighlights.map((item) => (
          <GlassCard key={item} className="p-4 text-sm text-white/75">
            {item}
          </GlassCard>
        ))}
      </div>

      <section className="mt-16 sm:mt-20 md:mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured dishes"
            title="Royal dishes from our kitchen"
            description="Signature plates curated by our kitchen — order online or book a table."
          />
          <Button asChild className="w-full border border-white/10 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
            <Link to="/menu">
              Full menu <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>

        <div className="mt-7 grid gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.length ? (
            featuredProducts.map((dish) => <FeaturedDishCard key={dish._id || dish.id} dish={dish} />)
          ) : (
            <GlassCard className="md:col-span-2 xl:col-span-3">
              No featured dishes added by admin yet.
            </GlassCard>
          )}
        </div>
      </section>

      <section className="mt-16 sm:mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments from our kitchen"
            description="Handpicked images from our dining room and signature plates."
          />
          <Button asChild className="w-full border border-white/10 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
            <Link to="/gallery">View gallery</Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {galleryItems.length ? (
            galleryItems.map((item) => (
              <Link
                key={item._id}
                to="/gallery"
                className="group overflow-hidden rounded-2xl border border-white/10 sm:rounded-3xl"
              >
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title || 'Gallery'}
                  className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44"
                />
              </Link>
            ))
          ) : (
            <GlassCard className="col-span-2">No gallery images yet.</GlassCard>
          )}
        </div>
      </section>

      <section className="mt-16 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-gold/20 via-white/[0.05] to-ember/15 p-6 sm:mt-20 sm:rounded-[2rem] sm:p-8 md:mt-24 md:p-12">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs">Ready to dine?</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Reserve a table or order online.
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
            Explore our story, browse the menu, or book your table whenever you are ready.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] sm:w-auto">
              <Link to="/reservations">Reserve now</Link>
            </Button>
            <Button asChild className="w-full border border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
              <Link to="/about">About Zaika</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
