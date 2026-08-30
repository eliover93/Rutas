import { createClient } from '@/lib/supabase/server';
import { createProposal, deleteProposal } from './actions';

const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviado',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
};

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

export default async function ProposalsPage() {
  const supabase = await createClient();
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Propuestas de viaje</h1>

      <form
        action={createProposal}
        className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 p-5 sm:grid-cols-2"
      >
        <input
          name="title"
          placeholder="Título del viaje"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          name="client_name"
          placeholder="Nombre del cliente"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          name="destination"
          placeholder="Destino (ej. Bali)"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-cyan-600 py-2 text-sm font-medium text-white hover:bg-cyan-700 sm:col-span-2"
        >
          Crear propuesta
        </button>
      </form>

      <div className="space-y-3">
        {proposals?.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >
            <div>
              <p className="font-medium text-slate-900">{p.title}</p>
              <p className="text-sm text-slate-500">
                {p.client_name} · {p.destination}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                {STATUS_LABEL[p.status]}
              </span>
              <a
                href={`/dashboard/editor/${p.id}`}
                className="text-sm text-slate-600 hover:underline"
              >
                Editar
              </a>
              <a
                href={`/p/${p.public_slug}`}
                target="_blank"
                className="text-sm text-cyan-600 hover:underline"
              >
                Ver
              </a>
              <form action={deleteProposal.bind(null, p.id)}>
                <button type="submit" className="text-sm text-red-500 hover:underline">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
        {!proposals?.length && (
          <p className="text-sm text-slate-400">Aún no hay propuestas. Crea la primera arriba.</p>
        )}
      </div>
    </div>
  );
}
