'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { createClient } from '@/lib/supabase/client';

const SHOWCASE_CARDS = [
  {
    id: 'islandia',
    label: 'Islandia',
    img: 'https://picsum.photos/seed/rutas-islandia-d4/600/400',
    wrapClass: 'translate-x-16 translate-y-8 rotate-6 scale-90 z-0',
  },
  {
    id: 'japon',
    label: 'Japón',
    img: 'https://picsum.photos/seed/rutas-japon-d1/600/400',
    wrapClass: '-translate-x-16 translate-y-8 -rotate-6 scale-90 z-0',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      {/* COLUMNA IZQUIERDA — formulario */}
      <div className="bg-topo-light relative flex items-center justify-center px-6 py-12">
        <div className="relative z-10 w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2.5">
            <Compass size={22} className="text-primary" strokeWidth={2} />
            <span className="font-display text-lg tracking-tight text-foreground">Rutas</span>
          </Link>

          <h1 className="mb-1 font-display text-3xl text-foreground">Bienvenido de vuelta</h1>
          <p className="mb-8 text-sm text-muted-foreground">Entra para seguir editando tus propuestas.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="tucorreo@agencia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3.5 text-sm text-foreground outline-none transition-shadow duration-150 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-medium text-muted-foreground">Contraseña</label>
                <a href="/auth/forgot-password" className="text-xs text-primary transition-colors hover:text-primary-hover">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3.5 text-sm text-foreground outline-none transition-shadow duration-150 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </motion.button>

            <p className="pt-1 text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <a href="/auth/signup" className="font-medium text-primary transition-colors hover:text-primary-hover">
                Crear cuenta
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* COLUMNA DERECHA — showcase */}
      <div className="bg-topo-dark relative hidden overflow-hidden bg-[#241F1A] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 30% 15%, oklch(0.6 0.17 45 / 0.3), transparent 55%)' }}
        />

        <p className="relative max-w-sm font-display text-2xl leading-snug text-white">
          Convertimos cada propuesta en una experiencia que se vende sola.
        </p>

        <div className="relative flex flex-1 items-center justify-center">
          {SHOWCASE_CARDS.map((card) => (
            <div key={card.id} className={`absolute w-56 overflow-hidden rounded-2xl shadow-xl ${card.wrapClass}`}>
              <div className="relative h-40">
                <img src={card.img} alt={card.label} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-on-image text-xs font-medium text-white">{card.label}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="animate-float relative z-20 w-64 overflow-hidden rounded-2xl bg-surface shadow-2xl">
            <div className="relative h-40">
              <img
                src="https://picsum.photos/seed/rutas-kenia-d2/600/400"
                alt="Kenia"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-on-image mb-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  Kenia
                </span>
                <p className="text-on-image text-sm font-semibold leading-tight text-white">Safari en Kenia · 5 días</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-primary">★★★★★</span>
              <span className="text-sm font-semibold text-foreground">2.450 €</span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-3 text-white/60">
          <div className="h-px flex-1 bg-white/10" />
          <p className="whitespace-nowrap text-xs">
            <span className="text-gradient-gold font-semibold">+1.000 propuestas</span> creadas por agencias de toda España
          </p>
        </div>
      </div>
    </div>
  );
}
