import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { FormField, FormTextArea } from '../components/FormField.jsx';
import { reservationService } from '../services/reservationService.js';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  guests: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  specialRequests: z.string().optional()
});

export function ReservationPage() {
  const [message, setMessage] = useState('');
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    await reservationService.createReservation({
      ...values,
      guests: Number(values.guests)
    });
    setMessage('Reservation submitted successfully.');
    reset();
  };

  return (
    <>
      <Seo title="Reservations" description="Book a premium table at Zaika Restaurant." />
      <SectionHeading eyebrow="Reservations" title="Reserve your table" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <GlassCard>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Name" {...register('name')} />
            <FormField label="Phone" {...register('phone')} />
            <FormField label="Email" className="md:col-span-2" {...register('email')} />
            <FormField label="Guest count" type="number" {...register('guests')} />
            <FormField label="Date" type="date" {...register('date')} />
            <FormField label="Time" type="time" {...register('time')} />
            <FormTextArea label="Special requests" className="md:col-span-2" {...register('specialRequests')} />
            <div className="md:col-span-2">
              <Button className="bg-gold text-surface-900 hover:bg-[#efcf88]">Book table</Button>
            </div>
          </form>
          {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
        </GlassCard>
        <GlassCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Dining policy</p>
          <p className="text-sm leading-7 text-white/70">
            Reservations are handled by the admin panel and can be accepted or rejected based on availability.
          </p>
        </GlassCard>
      </div>
    </>
  );
}
