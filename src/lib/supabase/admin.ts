import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// ⚠️ Bypassa RLS por completo. Importar SOLO desde rutas de servidor de
// confianza (webhooks de Stripe, panel /admin). Nunca desde un Client Component.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
