import type { ItineraryDay } from '@/types/database.types';

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  if (!days.length) return null;

  return (
    <section className="px-5 py-6">
      <h2 className="mb-4 font-[var(--font-theme)] text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
        Itinerario
      </h2>
      <ol className="space-y-4 border-l-2 pl-5" style={{ borderColor: 'var(--color-accent)' }}>
        {days.map((day) => (
          <li key={day.id} className="relative">
            <span
              className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full"
              style={{ background: 'var(--color-primary)' }}
            />
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
              Día {day.day_number}
            </p>
            <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>
              {day.title}
            </h3>
            {day.description && (
              <p className="mt-1 text-sm text-slate-500">{day.description}</p>
            )}
            {day.accommodation && (
              <p className="mt-1 text-xs text-slate-400">🛏 {day.accommodation}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
