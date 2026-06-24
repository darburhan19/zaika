import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { GlassCard, SectionHeading } from '../../components/ui.jsx';
import { Seo } from '../../components/Seo.jsx';

export function AdminCustomersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users').then((response) => setUsers(response.data.users || [])).catch(() => null);
  }, []);

  return (
    <>
      <Seo title="Customers" description="View customer accounts and order history." />
      <SectionHeading eyebrow="Customers" title="Customer management" />
      <div className="mt-8 space-y-4">
        {users.map((user) => (
          <GlassCard key={user._id}>
            <p className="font-display text-2xl">{user.name}</p>
            <p className="mt-2 text-sm text-white/65">{user.email}</p>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
