import { Compass } from 'lucide-react';
import type { ItineraryDay, DayCategory } from '@/types/database.types';

const CATEGORY_LABEL: Record<DayCategory, string> = {
  naturaleza: 'Naturaleza',
  gastronomia: 'Gastronomía',
  cultura: 'Cultura',
  aventura: 'Aventura',
  playa: 'Playa',
  descanso: 'Descanso',
};

export function DayCard({ day }: { day: ItineraryDay }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-36 w-full" style={{ background: 'var(--color-accent)' }}>
        {day.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={day.image_url} alt={day.title ?? ''} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Compass size={28} style={{ color: 'var(--color-primary)' }} className="opacity-50" />
          </div>
        )}
        {day.image_credit && (
          <a
            href={day.image_credit_url ?? '#'}
            target="_blank"
            className="absolute bottom-1 right-1 rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-white/80 backdrop-blur-sm hover:text-white"
          >
            {day.image_credit} / Unsplash
          </a>
        )}
      </div>
      <div className="p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
            Día {day.day_number}
          </span>
          {day.category && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}
            >
              {CATEGORY_LABEL[day.category]}
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {day.title}
        </h3>
        {day.description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{day.description}</p>}
      </div>
    </div>
  );
}
