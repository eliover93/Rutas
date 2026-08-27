import { Check, X } from 'lucide-react';
import type { Proposal } from '@/types/database.types';

export function PriceBreakdown({ proposal }: { proposal: Proposal }) {
  const includes = proposal.price_includes ?? [];
  const excludes = proposal.price_excludes ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 px-8 py-8 md:grid-cols-[1fr_1.2fr_1.2fr] md:items-start" style={{ background: 'var(--color-text)' }}>
      {proposal.price && (
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">Precio total por persona</p>
          <p className="mt-1 text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {proposal.price} €
          </p>
        </div>
      )}

      {includes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">Incluye</p>
          <ul className="space-y-1.5 text-sm text-white/90">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 flex-shrink-0 text-emerald-400" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {excludes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">No incluye</p>
          <ul className="space-y-1.5 text-sm text-white/50">
            {excludes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <X size={15} className="mt-0.5 flex-shrink-0 text-white/30" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
