import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// Aviso em vez de throw: um throw no nível do módulo quebra o build da Vercel
// durante a coleta de dados das rotas. Se faltarem as variáveis, as chamadas
// falham em tempo de execução (não durante o build).
if ((!supabaseUrl || !supabaseKey) && typeof window !== 'undefined') {
  console.warn('Variáveis de ambiente do Supabase ausentes. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
  auth: {
    // Mantém a sessão salva no navegador entre navegações e recarregamentos
    persistSession: true,
    // Renova o token automaticamente antes de expirar (evita "cair" o login)
    autoRefreshToken: true,
    // Detecta tokens vindos por URL (fluxo de redefinição de senha, etc.)
    detectSessionInUrl: true,
    storageKey: 'portal-saude-auth'
  }
})

// Função auxiliar para formatação de datas
export const formatDateForSupabase = (dateString) => {
  if (!dateString) return null
  
  // Se já está no formato ISO
  if (dateString.includes('T')) {
    return dateString
  }
  
  // Se está no formato DD/MM/YYYY
  if (dateString.includes('/')) {
    const parts = dateString.split('/')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
  }
  
  return dateString
}

// Função auxiliar para formatação de dados de saída
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  return date.toLocaleDateString('pt-BR')
}