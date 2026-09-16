import { FileText, Syringe, CalendarDays, Coins, ShieldCheck } from 'lucide-react';
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
// a una búsqueda siempre actual; si la agencia escribe su propio texto,
// mostramos eso en su lugar.
export function PracticalInfo({ proposal }: { proposal: Proposal }) {
  if (!proposal.show_practical_info) return null;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hola, me interesa añadir la gestión de trámites y visados a la propuesta "${proposal.title}"`
  )}`;

  return (
    <section className="border-t border-black/5 p-8">
      <h2 className="mb-2 font-[var(--font-theme)] text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
        Antes de viajar
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Nada complicado — son trámites sencillos que miles de viajeros completan cada año. Aquí tienes todo lo que
        necesitas, siempre actualizado.
      </p>

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

      {proposal.offer_visa_service && (
        <div className="mt-5 flex items-start gap-4 rounded-2xl p-5" style={{ background: 'var(--color-accent)' }}>
          <ShieldCheck size={24} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
              ¿Prefieres no ocuparte de nada de esto?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Nos encargamos de todo el papeleo por ti — visado, formularios y cualquier trámite necesario.
              {proposal.visa_service_price && ` ${proposal.visa_service_price}.`}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              Añadir gestión de trámites
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
