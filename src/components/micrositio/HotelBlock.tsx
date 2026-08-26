import { Hotel, MapPin } from 'lucide-react';
import type { Proposal } from '@/types/database.types';

export function HotelBlock({ proposal }: { proposal: Proposal }) {
  if (!proposal.hotel_name) return null;

  const mapsSearchUrl =
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(proposal.hotel_name + ', ' + proposal.destination);

  const imageContent = proposal.hotel_image_url ? (
    <img src={proposal.hotel_image_url} alt={proposal.hotel_name} className="absolute inset-0 h-full w-full object-cover" />
  ) : (
    <div className="flex h-full items-center justify-center">
      <Hotel size={28} className="text-slate-300" />
    </div>
  );

  const starsContent = proposal.hotel_stars ? (
    <div className="mt-1" style={{ color: 'var(--color-primary)' }}>
      {'*'.repeat(proposal.hotel_stars)}
      <span className="text-slate-300">{'*'.repeat(5 - proposal.hotel_stars)}</span>
    </div>
  ) : null;

  const creditContent = proposal.hotel_image_credit ? (
    <a href={proposal.hotel_image_credit_url || '#'} target="_blank" className="mt-1 block text-[10px] text-slate-300 hover:underline">
      Foto: {proposal.hotel_image_credit} / Unsplash
    </a>
  ) : null;

  return (
    <div className="flex overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="relative h-32 w-40 flex-shrink-0 bg-slate-100">
        {imageContent}
      </div>
      <div className="flex flex-col justify-center p-4">
        <p className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-400">
          <Hotel size={13} /> Alojamiento
        </p>
        <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
          {proposal.hotel_name}
        </h3>
        {starsContent}
        
          <a href={mapsSearchUrl}
          target="_blank"
          className="mt-2 flex w-fit items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          <MapPin size={12} /> Ver en Google Maps
        </a>
        {creditContent}
      </div>
    </div>
  );
}
