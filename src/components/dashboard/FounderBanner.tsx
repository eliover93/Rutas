'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function FounderBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative mb-6 rounded-2xl border border-primary/30 bg-secondary p-5">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X size={16} />
      </button>
      <p className="pr-8 text-sm text-foreground">
        <span className="mr-1.5">🚀</span>
        <strong>Oferta Especial Fundadores:</strong> consigue el plan Pro por solo 19€/mes para siempre — solo
        para las primeras 20 agencias.
      </p>
      <Link
        href="/dashboard/billing"
        className="mt-3 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
      >
        Conseguir precio fundador
      </Link>
    </div>
  );
}
