import { Hotel, MapPin } from 'lucide-react';
import type { ItineraryDay } from '@/types/database.types';

// Un banner por cada alojamiento DISTINTO que aparezca en los días del
// itinerario -- si todos los días comparten el mismo hotel, sale uno solo;
// si cambia de ciudad (ej. Japón: Tokio, Hakone, Kioto...), sale uno por
// cada hotel, todos con el mismo diseño. Sin fotos ni estrellas: Unsplash
// nunca va a tener la foto real de un hotel privado concreto.
export function HotelBlock({ days, destination }: { days: ItineraryDay[]; destination: string }) {
  const hotels = Array.from(
    new Set(days.map((d) => d.accommodation).filter((h): h is string => Boolean(h && h.trim())))
  );

  if (hotels.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="font-[var(--font-theme)] text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
        {hotels.length > 1 ? 'Alojamientos' : 'Alojamiento'}
      </h2>
      {hotels.map((hotelName) => {
        const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${hotelName}, ${destination}`
        )}`;
        return (
          <div key={hotelName} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--color-accent)' }}
            >
              <Hotel size={22} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">Alojamiento</p>
              <h3 className="truncate text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                {hotelName}
              </h3>
            </div>
            <a
              href={mapsSearchUrl}
              target="_blank"
              className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              <MapPin size={13} /> Ver en Maps
            </a>
          </div>
        );
      })}
    </div>
  );
}
