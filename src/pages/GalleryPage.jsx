import { Seo } from '../components/Seo.jsx';
import { GlassCard, SectionHeading } from '../components/ui.jsx';
import { galleryImages } from '../data/mockData.js';

export function GalleryPage() {
  return (
    <>
      <Seo title="Gallery" description="Explore the ambience and food photography at Zaika Restaurant." />
      <SectionHeading eyebrow="Gallery" title="Visual stories from Zaika" />
      <div className="mt-8 columns-1 gap-4 space-y-4 md:columns-2 xl:columns-3">
        {galleryImages.map((image) => (
          <GlassCard key={image} className="overflow-hidden p-0">
            <img src={image} alt="Zaika restaurant gallery" className="h-auto w-full object-cover" />
          </GlassCard>
        ))}
      </div>
    </>
  );
}
