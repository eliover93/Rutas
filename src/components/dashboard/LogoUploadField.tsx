'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export function LogoUploadField({ currentLogoUrl }: { currentLogoUrl?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files?.[0] && inputRef.current) {
      inputRef.current.files = files;
      setFileName(files[0].name);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Logo de la agencia</label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mb-3 cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/30'
        }`}
      >
        <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          <span className="sm:hidden">Subir archivo</span>
          <span className="hidden sm:inline">Subir desde tu ordenador — o arrastra la imagen aquí</span>
        </p>
        {fileName && <p className="mt-1.5 text-xs font-medium text-primary">Archivo elegido: {fileName}</p>}

        <input
          ref={inputRef}
          name="logo_file"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>

      <p className="mb-1.5 text-[11px] text-muted-foreground">O pega directamente una URL:</p>
      <input
        name="logo_url"
        type="url"
        placeholder="https://tuagencia.com/logo.png"
        defaultValue={currentLogoUrl ?? ''}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
      <p className="mt-1.5 text-[11px] text-muted-foreground">Si subes un archivo, se usará ese en vez de la URL.</p>

      {currentLogoUrl && (
        <div className="mt-3">
          <p className="mb-1 text-[11px] text-muted-foreground">Logo actual:</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentLogoUrl} alt="Logo actual" className="h-12 rounded-lg border border-border object-contain p-2" />
        </div>
      )}
    </div>
  );
}
