import { GlassCard } from './ui.jsx';

export function InfoCard({ title, value, detail }) {
  return (
    <GlassCard className="p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{title}</p>
      <p className="mt-3 font-display text-3xl text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-white/65">{detail}</p> : null}
    </GlassCard>
  );
}
