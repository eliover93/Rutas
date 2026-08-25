'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, LayoutTemplate, Settings, Compass, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signOut } from '@/app/dashboard/actions';

const NAV = [
  { href: '/dashboard', label: 'Propuestas', icon: LayoutGrid },
  { href: '/dashboard/templates', label: 'Plantillas', icon: LayoutTemplate },
  { href: '/dashboard/settings', label: 'Ajustes / Branding', icon: Settings },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-6 py-5">
        <Compass size={20} className="text-primary" />
        <span className="font-display text-lg tracking-tight text-foreground">Rutas</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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
          onClick={onNavigate}
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
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Barra superior — solo móvil */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Compass size={18} className="text-primary" />
          <span className="font-display text-base text-foreground">Rutas</span>
        </Link>
        <button type="button" onClick={() => setOpen(true)} className="text-muted-foreground">
          <Menu size={22} />
        </button>
      </div>

      {/* Cajón deslizante — solo móvil */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-surface shadow-2xl md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-4 text-muted-foreground"
              >
                <X size={20} />
              </button>
              <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar fija — solo escritorio */}
      <aside className="hidden h-screen w-60 flex-shrink-0 flex-col border-r border-border bg-surface md:flex">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
