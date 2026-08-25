'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [agencyName, setAgencyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // La agencia y el perfil los crea el trigger handle_new_user en la BD
    // (security definer) — no dependen de que el navegador ya tenga sesión.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { agency_name: agencyName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Con "Confirm email" activado, signUp no abre sesión todavía.
    if (!data.session) {
      setCheckEmail(true);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  if (checkEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm text-center">
          <h1 className="mb-2 text-xl font-semibold text-slate-900">Revisa tu correo</h1>
          <p className="text-sm text-slate-500">
            Te hemos enviado un enlace de confirmación a <strong>{email}</strong>. Tu agencia
            "{agencyName}" se creará automáticamente en cuanto confirmes la cuenta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-900">Crea tu agencia</h1>
        <p className="text-sm text-slate-500">15 días de prueba gratis, sin tarjeta.</p>

        <input
          placeholder="Nombre de la agencia"
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-600 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Empezar prueba gratis'}
        </button>
      </form>
    </div>
  );
}
