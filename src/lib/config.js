// Configurações centralizadas do Portal Saúde Digital

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  ENDPOINTS: {
    EVENTOS: '/eventos',
    NOTICIAS: '/noticias',
    ANIMAIS: '/animais',
    ADOCAO_SOLICITACOES: '/adocao-solicitacoes',
    USUARIOS: '/usuarios',
    HERO: '/hero',
    CARROSSEL: '/carrossel',
    INSCRICOES: '/inscricoes',
    ADMIN_INSCRITOS: '/admin/inscritos'
  }
}

export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  TABLES: {
    EVENTOS: 'eventos',
    EVENTO_INSCRITOS: 'evento_inscritos',
    NOTICIAS: 'noticias',
    USUARIOS_ADMIN: 'usuarios_admin'
  },
  STORAGE: {
    EVENTOS: 'eventos',
    NOTICIAS: 'noticias'
  }
}

export const APP_CONFIG = {
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Portal Saúde Digital',
  ITEMS_PER_PAGE: {
    EVENTOS: 9,
    INSCRITOS: 30,
    NOTICIAS: 12
  }
}

// Função helper para construir URLs de API
export function buildApiUrl(endpoint, params = {}) {
  const url = new URL(API_CONFIG.BASE_URL + endpoint, 
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  )
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value))
    }
  })
  
  return url.toString()
}