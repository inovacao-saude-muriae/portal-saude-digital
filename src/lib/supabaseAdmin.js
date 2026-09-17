import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase com privilégios de administrador (service_role).
 * USO EXCLUSIVO NO SERVIDOR (API routes) — nunca importe em componentes cliente,
 * pois a service_role key ignora as políticas de RLS e não pode ser exposta.
 *
 * Requer as variáveis de ambiente:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (sem o prefixo NEXT_PUBLIC_)
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Configuração ausente: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local'
    )
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
