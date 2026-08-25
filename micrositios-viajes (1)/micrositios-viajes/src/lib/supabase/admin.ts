import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// ⚠️ Bypassa RLS por completo. Importar SOLO desde rutas de servidor de
// confianza (webhooks de Stripe, panel /admin). Nunca desde un Client Component.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
