import { FileText, Syringe, CalendarDays, Coins } from 'lucide-react';
import type { Proposal } from '@/types/database.types';

const buildLinks = (destination: string) => [
  {
    icon: FileText,
    label: 'Requisitos de entrada y visado',
    url: `https://www.google.com/search?q=${encodeURIComponent(`requisitos de entrada y visado para españoles en ${destination}`)}`,
  },
  {
    icon: Syringe,
    label: 'Vacunas recomendadas',
    url: `https://www.google.com/search?q=${encodeURIComponent(`vacunas recomendadas para viajar a ${destination}`)}`,
  },
  {
    icon: CalendarDays,
    label: 'Mejor época para viajar',
    url: `https://www.google.com/search?q=${encodeURIComponent(`mejor época para viajar a ${destination}`)}`,
  },
  {
    icon: Coins,
    label: 'Moneda y cambio',
    url: `https://www.google.com/search?q=${encodeURIComponent(`moneda y cambio en ${destination}`)}`,
  },
];

// Nunca alojamos nosotros los datos de visado/vacunas — cambian con el
// tiempo y dependen de la nacionalidad del viajero. Por defecto enlazamos
// a una búsqueda siempre actual; si la agencia escribe su propio texto
// (porque tiene a alguien que lo mantiene al día), mostramos eso en su
// lugar.
export function PracticalInfo({ proposal }: { proposal: Proposal }) {
  if (!proposal.show_practical_info) return null;

  return (
    <section className="border-t border-black/5 p-8">
      <h2 className="mb-4 font-[var(--font-theme)] text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
        Antes de viajar
      </h2>

      {proposal.practical_info_notes ? (
        <div className="whitespace-pre-line rounded-2xl border border-black/5 bg-white p-5 text-sm leading-relaxed text-slate-600">
          {proposal.practical_info_notes}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {buildLinks(proposal.destination).map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              className="hover-lift flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 text-sm font-medium text-slate-700 hover:border-primary/40"
            >
              <link.icon size={18} style={{ color: 'var(--color-primary)' }} />
              {link.label}
            </a>
          ))}
        </div>
      )}

      <p className="mt-3 text-[11px] text-slate-400">
        {proposal.practical_info_notes
          ? 'Información proporcionada por la agencia.'
          : 'Enlaces de búsqueda actualizados — consulta siempre fuentes oficiales antes de viajar.'}
      </p>
    </section>
  );
}
