'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface UnsplashResult {
  id: string;
  url: string;
  thumbUrl: string;
  credit: string;
  creditUrl: string;
}

export function UnsplashField({
  name,
  label,
  defaultValue,
  creditName,
  creditUrlName,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  /** Nombres de los inputs ocultos donde se guarda la atribución */
  creditName: string;
  creditUrlName: string;
}) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [credit, setCredit] = useState<{ name: string; url: string } | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnsplashResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/unsplash/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  function select(img: UnsplashResult) {
    setValue(img.url);
    setCredit({ name: img.credit, url: img.creditUrl });
    setOpen(false);
    fetch(`/api/unsplash/track-download?id=${img.id}`);
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">{label}</label>

      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="URL de la imagen"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-shrink-0 rounded-lg border border-slate-200 px-3 text-slate-500 hover:bg-slate-50"
        >
          <Search size={15} />
        </button>
      </div>

      {/* Campos ocultos: la atribución viaja con el formulario al server action */}
      <input type="hidden" name={creditName} value={credit?.name ?? ''} />
      <input type="hidden" name={creditUrlName} value={credit?.url ?? ''} />

      {value && (
        <div className="mt-2 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-16 w-24 rounded-lg object-cover" />
          {credit && (
            <p className="text-[11px] text-slate-400">
              Foto:{' '}
              <a href={credit.url} target="_blank" className="underline">
                {credit.name}
              </a>{' '}
              en Unsplash
            </p>
          )}
        </div>
      )}

      {open && (
        <div className="mt-2 rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  search();
                }
              }}
              placeholder="Buscar en Unsplash (ej. safari kenia)"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={search}
              className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : 'Buscar'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-4 gap-1.5">
              {results.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => select(img)}
                  className="overflow-hidden rounded transition-opacity hover:opacity-80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.thumbUrl} alt="" className="h-16 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
