import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { Seo } from '../../components/Seo.jsx';

export function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);

  const loadReservations = async () => {
    const response = await api.get('/admin/reservations');
    setReservations(response.data.reservations || []);
  };

  useEffect(() => {
    loadReservations().catch(() => null);
  }, []);

  return (
    <>
      <Seo title="Admin Reservations" description="Manage reservation requests." />
      <SectionHeading eyebrow="Reservations" title="Reservation management" />
      <div className="mt-8 space-y-4">
        {reservations.map((reservation) => (
          <GlassCard key={reservation._id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl">{reservation.name}</p>
              <p className="mt-2 text-sm text-white/65">
                {reservation.guests} guests on {new Date(reservation.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => api.patch(`/reservations/${reservation._id}/status`, { status: 'accepted' }).then(loadReservations)}
                className="bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
              >
                Accept
              </Button>
              <Button
                onClick={() => api.patch(`/reservations/${reservation._id}/status`, { status: 'rejected' }).then(loadReservations)}
                className="bg-red-500/15 text-red-200 hover:bg-red-500/25"
              >
                Reject
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
