'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, LayoutTemplate, Settings, Compass, LogOut } from 'lucide-react';
import { signOut } from '@/app/dashboard/actions';

const NAV = [
  { href: '/dashboard', label: 'Propuestas', icon: LayoutGrid },
  { href: '/dashboard/templates', label: 'Plantillas', icon: LayoutTemplate },
  { href: '/dashboard/settings', label: 'Ajustes / Branding', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col border-r border-border bg-surface">
      <Link href="/" className="flex items-center gap-2.5 px-6 py-5">
        <Compass size={20} className="text-primary" />
        <span className="font-display text-lg tracking-tight text-foreground">Rutas</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-secondary/50'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <Link
          href="/dashboard/billing"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50"
        >
          Facturación
        </Link>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            window.location.href = '/';
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
