'use client';

import { updateProposalStatus } from './client-actions';
import type { Proposal } from '@/types/database.types';

export function CtaBar({ proposal }: { proposal: Proposal }) {
  const accepted = proposal.status === 'accepted';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl gap-3 p-4">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `Hola, quiero pedir cambios en la propuesta "${proposal.title}"`
          )}`}
          target="_blank"
          className="flex-1 rounded-xl border py-3 text-center text-sm font-medium transition-colors sm:flex-none sm:px-8"
          style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
        >
          Solicitar cambios
        </a>
        <button
          disabled={accepted}
          onClick={() => updateProposalStatus(proposal.id)}
          className="flex-1 rounded-xl py-3 text-center text-sm font-medium text-white transition-opacity disabled:opacity-60 sm:flex-none sm:px-8"
          style={{ background: 'var(--color-primary)' }}
        >
          {accepted ? 'Propuesta aceptada ✓' : 'Aceptar propuesta'}
        </button>
      </div>
    </div>
  );
}
