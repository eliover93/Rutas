import { Hotel, Calendar, Wallet } from 'lucide-react';
import type { Proposal, ItineraryDay } from '@/types/database.types';

export function QuickFacts({ proposal, days }: { proposal: Proposal; days: ItineraryDay[] }) {
  const facts = [
    proposal.hotel_name && { icon: Hotel, label: proposal.hotel_name },
    days.length > 0 && { icon: Calendar, label: `${days.length} días` },
    proposal.price && { icon: Wallet, label: `${proposal.price} € / persona` },
  ].filter(Boolean) as { icon: typeof Hotel; label: string }[];

  if (facts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 border-b border-black/5 px-8 py-4">
      {facts.map((fact, i) => (
        <div key={i} className="flex items-center gap-2 rounded-full bg-black/[0.03] px-3 py-1.5 text-sm">
          <fact.icon size={15} style={{ color: 'var(--color-primary)' }} />
          <span style={{ color: 'var(--color-text)' }}>{fact.label}</span>
        </div>
      ))}
    </div>
  );
}
