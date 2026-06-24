import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { FormField, FormTextArea } from '../components/FormField.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export function ContactPage() {
  const [message, setMessage] = useState('');
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    setMessage('We received your message.');
    reset();
  };

  return (
    <>
      <Seo title="Contact" description="Contact Zaika Restaurant and locate us on Google Maps." />
      <SectionHeading eyebrow="Contact" title="Reach our team" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <GlassCard>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Name" {...register('name')} />
            <FormField label="Email" {...register('email')} />
            <FormTextArea label="Message" {...register('message')} />
            <Button className="bg-gold text-surface-900 hover:bg-[#efcf88]">Send message</Button>
          </form>
          {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
        </GlassCard>
        <GlassCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Business info</p>
          <p>Zaika Restaurant, Handwara, Jammu & Kashmir, India</p>
          <p>Phone: +91 70000 00000</p>
          <p>Email: hello@zaikarestaurant.in</p>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <iframe
              title="Zaika restaurant map"
              src={import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || 'https://www.google.com/maps'}
              className="h-80 w-full"
              loading="lazy"
            />
          </div>
        </GlassCard>
      </div>
    </>
  );
}
