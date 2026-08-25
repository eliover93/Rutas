import type { Proposal, ThemeKey } from '@/types/database.types';
import { resolveCoverImage } from '@/lib/coverImage';

export function Hero({ proposal, theme }: { proposal: Proposal; theme: ThemeKey }) {
  const src = resolveCoverImage(proposal.cover_image_url, theme);

  return (
    <div className="relative h-[420px] w-full overflow-hidden sm:h-[480px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={proposal.destination} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'oklch(0.16 0.03 250 / 0.35)' }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, oklch(0.16 0.03 250 / 0.9), oklch(0.16 0.03 250 / 0.35) 55%, oklch(0.16 0.03 250 / 0.1))',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <span
          className="text-on-image mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide"
          style={{ background: 'var(--color-primary)' }}
        >
          {proposal.destination}
        </span>
        <h1 className="text-on-image max-w-2xl font-[var(--font-theme)] text-4xl font-bold leading-tight">
          {proposal.title}
        </h1>
        <p className="text-on-image mt-2 text-sm text-white/90">Propuesta para {proposal.client_name}</p>
      </div>

      {proposal.cover_image_credit && (
        <a
          href={proposal.cover_image_credit_url ?? '#'}
          target="_blank"
          className="absolute right-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur-sm hover:text-white"
        >
          Foto: {proposal.cover_image_credit} / Unsplash
        </a>
      )}
    </div>
  );
}
