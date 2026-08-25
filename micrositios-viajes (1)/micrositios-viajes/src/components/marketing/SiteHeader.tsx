import Link from 'next/link';
import { Compass } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50" suppressHydrationWarning>
      <div className="glass-panel mx-auto mt-4 flex w-[min(1120px,92vw)] items-center justify-between rounded-full px-5 py-3">
        {/* Columna vacía a la izquierda: junto con el ancho fijo de la nav
            de la derecha, mantiene el logo centrado de verdad. */}
        <div className="flex-1" aria-hidden />

        <Link href="/" className="flex flex-1 items-center justify-center gap-2">
          <Compass size={20} className="text-primary" />
          <span className="font-display text-lg tracking-tight text-foreground">Rutas</span>
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-2 text-sm">
          <a
            href="/p/demo-kenia"
            target="_blank"
            className="hidden rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline"
          >
            Demo cliente
          </a>
          <Link
            href="/auth/login"
            className="hidden rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline"
          >
            Acceso agencias
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Pedir precio
          </Link>
        </nav>
      </div>
    </header>
  );
}
