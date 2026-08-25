import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Field, TextArea } from '@/components/dashboard/FormField';
import { UnsplashField } from '@/components/dashboard/UnsplashField';
import { updateProposalDetails, upsertDay, deleteDay } from './actions';

const CATEGORIES = ['naturaleza', 'gastronomia', 'cultura', 'aventura', 'playa', 'descanso'];

const THEMES = [
  { value: '', label: 'Automático según destino' },
  { value: 'mediterraneo', label: 'Mediterráneo' },
  { value: 'asiatico', label: 'Asiático / Zen' },
  { value: 'tropical', label: 'Tropical / Paradise' },
  { value: 'nordico', label: 'Nórdico / Ártico' },
  { value: 'safari', label: 'Safari / Savanna' },
];

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proposal } = await supabase.from('proposals').select('*').eq('id', id).single();
  if (!proposal) notFound();

  const { data: days } = await supabase
    .from('itinerary_days')
    .select('*')
    .eq('proposal_id', id)
    .order('order_index');

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">{proposal.title}</h1>
        <a href={`/p/${proposal.public_slug}`} target="_blank" className="text-sm text-cyan-600 hover:underline">
          Ver micrositio →
        </a>
      </div>

      {/* Detalles generales */}
      <form
        action={updateProposalDetails.bind(null, proposal.id)}
        className="space-y-4 rounded-2xl border border-slate-200 p-5"
      >
        <h2 className="font-medium text-slate-900">Detalles generales</h2>
        <Field label="Título" name="title" defaultValue={proposal.title} />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Tema visual</label>
          <select
            name="theme_key"
            defaultValue={proposal.theme_key ?? ''}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-400">
            Por defecto se detecta solo por el destino — elige uno a mano si quieres forzar un estilo distinto.
          </p>
        </div>

        <UnsplashField
          label="Foto de portada"
          name="cover_image_url"
          defaultValue={proposal.cover_image_url ?? ''}
          creditName="cover_image_credit"
          creditUrlName="cover_image_credit_url"
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Mensaje personalizado para el cliente</label>
          <textarea
            name="client_message"
            defaultValue={proposal.client_message ?? ''}
            rows={3}
            placeholder='Ej. "Hola Marta, os he preparado esta ruta pensando en las auroras boreales que me comentasteis..."'
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-[11px] text-slate-400">Aparece destacado justo debajo de la cabecera del micrositio.</p>
        </div>

        <Field label="Precio total (€)" name="price" type="number" defaultValue={proposal.price ?? ''} />

        <h3 className="pt-2 text-sm font-medium text-slate-700">Hotel</h3>
        <Field label="Nombre del hotel" name="hotel_name" defaultValue={proposal.hotel_name ?? ''} />
        <Field
          label="Estrellas (1-5)"
          name="hotel_stars"
          type="number"
          min={1}
          max={5}
          defaultValue={proposal.hotel_stars ?? ''}
        />
        <UnsplashField
          label="Foto del hotel"
          name="hotel_image_url"
          defaultValue={proposal.hotel_image_url ?? ''}
          creditName="hotel_image_credit"
          creditUrlName="hotel_image_credit_url"
        />

        <h3 className="pt-2 text-sm font-medium text-slate-700">Precio: qué incluye (una línea por concepto)</h3>
        <TextArea name="price_includes" defaultValue={(proposal.price_includes ?? []).join('\n')} />
        <h3 className="text-sm font-medium text-slate-700">Precio: qué no incluye</h3>
        <TextArea name="price_excludes" defaultValue={(proposal.price_excludes ?? []).join('\n')} />

        <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
          Guardar cambios
        </button>
      </form>

      {/* Itinerario */}
      <div className="space-y-3">
        <h2 className="font-medium text-slate-900">Itinerario</h2>

        {days?.map((day) => (
          <form
            key={day.id}
            action={upsertDay.bind(null, proposal.id, day.id)}
            className="space-y-2 rounded-xl border border-slate-200 p-4"
          >
            <div className="grid grid-cols-2 gap-2">
              <Field label="Día nº" name="day_number" type="number" defaultValue={day.day_number} />
              <div>
                <label className="mb-1 block text-xs text-slate-500">Categoría</label>
                <select
                  name="category"
                  defaultValue={day.category ?? ''}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Field label="Título" name="title" defaultValue={day.title ?? ''} />
            <TextArea label="Descripción" name="description" defaultValue={day.description ?? ''} />
            <UnsplashField
              label="Foto del día"
              name="image_url"
              defaultValue={day.image_url ?? ''}
              creditName="image_credit"
              creditUrlName="image_credit_url"
            />
            <div className="flex gap-2 pt-1">
              <button type="submit" className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                Guardar día
              </button>
              <button
                formAction={deleteDay.bind(null, proposal.id, day.id)}
                className="rounded-lg px-3 py-1.5 text-xs text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </form>
        ))}

        {/* Nuevo día */}
        <form
          action={upsertDay.bind(null, proposal.id, null)}
          className="space-y-2 rounded-xl border border-dashed border-slate-300 p-4"
        >
          <p className="text-sm font-medium text-slate-700">Añadir día</p>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Día nº" name="day_number" type="number" defaultValue={(days?.length ?? 0) + 1} />
            <div>
              <label className="mb-1 block text-xs text-slate-500">Categoría</label>
              <select name="category" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="">—</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Field label="Título" name="title" />
          <TextArea label="Descripción" name="description" />
          <UnsplashField label="Foto del día" name="image_url" creditName="image_credit" creditUrlName="image_credit_url" />
          <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
            Añadir día
          </button>
        </form>
      </div>
    </div>
  );
}
